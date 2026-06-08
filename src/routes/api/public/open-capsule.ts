import { createFileRoute } from "@tanstack/react-router";

const norm = (s: string) =>
  s.toLowerCase().trim().replace(/\s+/g, " ").replace(/[^a-z\s]/g, "");

export const Route = createFileRoute("/api/public/open-capsule")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const body = (await request.json().catch(() => ({}))) as {
            name?: string;
          };
          const raw = (body.name || "").toString();
          const nameKey = norm(raw);

          if (!nameKey || nameKey.length > 60) {
            return Response.json(
              { ok: false, reason: "invalid" },
              { status: 400 },
            );
          }

          const xff = request.headers.get("x-forwarded-for") || "";
          const ip =
            xff.split(",")[0].trim() ||
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-real-ip") ||
            "unknown";

          // Already opened by this name?
          const { data: byName } = await supabaseAdmin
            .from("capsule_opens")
            .select("name_key, opened_at")
            .eq("name_key", nameKey)
            .maybeSingle();

          if (byName) {
            return Response.json({
              ok: false,
              reason: "already_opened",
              openedAt: byName.opened_at,
            });
          }

          // Already opened by this IP? (block silently — same household etc.)
          if (ip !== "unknown") {
            const { data: byIp } = await supabaseAdmin
              .from("capsule_opens")
              .select("name_key, opened_at")
              .eq("ip", ip)
              .maybeSingle();

            if (byIp) {
              return Response.json({
                ok: false,
                reason: "ip_already_opened",
                openedAt: byIp.opened_at,
              });
            }
          }

          const { error } = await supabaseAdmin
            .from("capsule_opens")
            .insert({ name_key: nameKey, ip });

          if (error) {
            // Race: someone inserted the same name between check and insert
            if (error.code === "23505") {
              return Response.json({ ok: false, reason: "already_opened" });
            }
            console.error("capsule_opens insert error", error);
            return Response.json(
              { ok: false, reason: "server_error" },
              { status: 500 },
            );
          }

          return Response.json({ ok: true });
        } catch (e) {
          console.error("open-capsule error", e);
          return Response.json(
            { ok: false, reason: "server_error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
