export interface PersonalMessage {
  name: string;
  message: string;
  memory?: string;
  thanks?: string;
  wish?: string;
}

export const messages: Record<string, PersonalMessage> = {
  sai: {
    name: "Sai",
    message:
      "From the first standup to the last deploy, you've been the steady signal in every noisy sprint. Thank you for teaching me that calm code reviews can change someone's entire week.",
    memory: "That 2 AM bug we hunted down with cold coffee and warmer laughter.",
    thanks: "For trusting me with the hard problems before I thought I was ready.",
    wish: "May every PR you open merge cleanly, and may your weekends stay sacred.",
  },
  rahul: {
    name: "Rahul",
    message:
      "You turned every whiteboard into a playground. Half the things I know about systems, I learned standing next to you, pretending I already understood.",
    memory: "The Friday demos that turned into philosophy sessions.",
    thanks: "For never letting a 'small question' feel small.",
    wish: "Build wild things. I'll be in the front row.",
  },
  priya: {
    name: "Priya",
    message:
      "Your kindness made this place feel like home long before the code did. Thank you for being the warm light in fluorescent rooms.",
    memory: "Chai breaks that solved more bugs than any debugger ever could.",
    thanks: "For every check-in that didn't have to happen, but always did.",
    wish: "May your inbox stay light and your weekends long.",
  },
  arjun: {
    name: "Arjun",
    message:
      "We started as teammates and somewhere between launch nights and lunch arguments, became something better. Thank you for the laughter that made deadlines bearable.",
    memory: "That release night when nothing worked and everything was hilarious.",
    thanks: "For being the person I could text at 1 AM with a bad idea.",
    wish: "Keep shipping. Keep laughing.",
  },
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-z\s]/g, "");

export function findMessage(input: string): PersonalMessage {
  const key = norm(input);
  if (!key) return fallback(input);
  if (messages[key]) return messages[key];
  // first name match
  const first = key.split(" ")[0];
  if (messages[first]) return messages[first];
  // partial includes either direction
  for (const k of Object.keys(messages)) {
    if (key.includes(k) || k.includes(first)) return messages[k];
  }
  return fallback(input);
}

function fallback(input: string): PersonalMessage {
  const display = input.trim() || "Friend";
  return {
    name: display.charAt(0).toUpperCase() + display.slice(1),
    message:
      "Thank you for being part of my journey. Whether our paths crossed for a moment or a thousand standups, you shaped the engineer I'm becoming.",
    thanks: "For every shared smile in a long hallway.",
    wish: "May the next chapter of your story be your best yet.",
  };
}

/** Unlock at 6:00 PM local time today. */
export function getUnlockTime(): Date {
  const stored = typeof window !== "undefined" ? localStorage.getItem("unlock_override") : null;
  if (stored) return new Date(stored);
  const d = new Date();
  d.setHours(18, 0, 0, 0);
  return d;
}
