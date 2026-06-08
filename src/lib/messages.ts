export interface PersonalMessage {
  name: string;
  message: string;
  memory?: string;
  thanks?: string;
  wish?: string;
}

export const messages: Record<string, PersonalMessage> = {
  atul: {
  name: "Atul",
  message:
    "Working with you has always been a good experience. Your backend knowledge and problem-solving approach have helped the team many times..",
  memory:
    "The many backend discussions where a simple question would turn into a deep dive into how things actually work.",
  wish:
    "Keep growing and building amazing things. Wishing you success in everything you do. 🚀",
},

govind: {
name: "Govind",
message:
"A chill person to work with and someone who always kept things simple. ",
memory:
"The random frontend discussions and day-to-day project work.",
wish:
"Wishing you all the best for the future and lots of success ahead. 🚀",
},

aryan: {
  name: "Aryan",
  message:
    "You’ve always had good technical knowledge. If I had to point out one thing I’ve enjoyed watching, it’s your growth. I still remember when you would sometimes convince yourself that a task was impossible before even starting it, only to eventually complete it successfully. Seeing that confidence improve over time has been great.",
  memory:
    "The moments when the task looked scary at first, but turned out completely manageable once you got started. 😄",
  wish:
    "Trust yourself a little more. You’re far more capable than you sometimes think. 💪",
},

kirti: {
  name: "Kirti",
  message:
    "You’re one of those people who simply gets things done. Give you a task and it gets completed without unnecessary noise. What I’ll remember the most, though, is your consistently positive and cheerful attitude",
  memory:
    "No matter what was happening around, you somehow managed to keep smiling. 😊",
  wish:
    "Keep spreading positivity wherever you go. And maybe add one extra round of testing before marking things done. 😄",
},

jayesh: {
  name: "Jayesh Sir",
  message:
    "You are genuinely one of the kindest people I’ve met during my time here. Your simplicity, humility, and the way you speak with people leave a lasting impression. Conversations with you always felt comfortable and meaningful.",
  memory:
    "The moments where a simple conversation with you made a stressful day feel lighter.",
  wish:
    "Wishing you happiness, good health, and continued success. 🙏",
},

vipin: {
  name: "Vipin",
  message:
    "Your as a UI designer is impressive, and your friendly nature makes collaboration easy. Working alongside you has always been a pleasant experience.",
  memory:
    "The design discussions where I got to see how much thought goes into creating a great user experience.",
  wish:
    "Keep creating beautiful designs and inspiring others. 🎨",
},

thakurlal: {
  name: "Thakurlal Sir",
  message:
    "To this day, I’m still not entirely sure whether you’re the most serious person in the room or one of the most chill. 😄 What I do know is that you’re a genuinely good person and someone I’ve always enjoyed working with.",
  memory:
    "Trying to figure out whether you were joking or being serious was sometimes a challenge in itself. 😂",
  wish:
    "Stay exactly the way you are. Wishing you all the best. 🙌",
},

thomas: {
  name: "Thomas Sir",
  message:
    "You are one of the best project managers I’ve had the chance to work with. You never focused only on the project; you also cared about the people working on it. That quality is rare and deeply appreciated.",
  memory:
    "I still remember being stuck on a problem late in the evening, well past working hours. Instead of asking me to keep struggling, you told me to go home, push the code, and send the branch because you would look at it yourself later. That gesture has stayed with me ever since.",
  wish:
    "Thank you for always leading with understanding and support. 🙏",
},

mohit: {
  name: "Mohit Sir",
  message:
    "You are a hardworking and dedicated tester with a strong eye for detail. What stands out even more is your willingness to learn beyond your current responsibilities.",
  memory:
    "The effort you put into ensuring quality was always visible.",
  wish:
    "Keep exploring new areas of software development and continue growing. 🚀",
},

nisha: {
name: "Nisha Ma'am",
message:
"Working with you has always been smooth and comfortable. Your calm approach and commitment to quality are appreciated more than you might realize.",
memory:
"The consistency and professionalism you brought to every task.",
thanks:
"Thank you for always ensuring that quality remains a priority.",
wish:
"Just one small request: as a project manager, try not to panic when things go wrong. Projects will always have challenges, but when the person leading the team stays calm, the developers naturally feel calmer and more confident too. Your composure can set the tone for the entire team. 🙌",
},


poornima: {
  name: "Poornima",
  message:
    "A  backend developer with good technical understanding and confidence in what you do. It has always been great collaborating with you.",
  memory:
    "The backend discussions where your experience and perspective were always valuable.",
  wish:
    "Just one small request: sometimes listen to frontend developers too — we occasionally know a thing or two about backend as well. 😄",
},

rohit: {
  name: "Rohit Sir",
  message:
    "A great team lead and without a doubt one of the strongest developers in the company. Your technical expertise combined with leadership skills make you someone many people look up to.",
  memory:
    "Whenever there was a difficult technical challenge, you were usually the person everyone turned to.",
  wish:
    "Keep leading teams and building great things. 🚀",
},

pradeep: {
  name: "Pradeep Sir",
  message:
    "Although I didn’t get many opportunities to work closely with you, one thing I consistently heard was how disciplined and structured your approach is. Giving developers enough room to work while still maintaining accountability is a valuable leadership quality.",
  memory:
    "The respect people had when speaking about your leadership style.",
  wish:
    "Wishing you continued success in guiding and growing strong teams. 🙌",
},

piyush: {
  name: "Piyush",
  message:
    "Among all the things I found in this company, finding a friend like you is something I value the most. Somewhere along the way, you stopped being just a colleague and became more like a brother. Thank you for all the support, advice, and countless conversations.",
  memory:
    "The debugging sessions, random discussions, and the moments where work became secondary to friendship. ",
  wish:
    "No matter where life takes us, I hope we stay in touch. Wishing you nothing but success and happiness, brother. 🤝",
},

atulsir: {
  name: "Atul Sir",
  message:
    "One thing I’ve always admired about you is your ability to handle pressure. No matter how challenging the situation was, you stayed focused on finding solutions instead of dwelling on problems. That mindset is inspiring.",
  memory:
    "Watching seemingly impossible situations become manageable because of your calm decision-making.",
  wish:
    "Wishing you and the company continued growth and success. 🚀",
},

chandra: {
  name: "Chandra Sir",
  message:
    "You are one of the most down-to-earth people I’ve ever met. Despite being a founder, you never made people feel a hierarchy when talking to you. Every conversation felt natural, comfortable, and genuine.",
  memory:
    "The conversations that felt less like talking to a founder and more like talking to a senior colleague or mentor.",
  wish:
    "May you continue inspiring people through your humility and leadership. 🙏",
},

Vinee: {
name: "Vinee",
message:
"Thank you for being approachable whenever support was needed. One thing I've always felt is that when employees are heard and their feedback is understood, it creates a much better workplace for everyone. I appreciate the efforts made in that direction and hope that focus continues to grow.",
memory:
"The conversations where concerns could be discussed openly and honestly.",
wish:
"Wishing you all the best ahead. May you continue building an environment where people feel comfortable sharing their thoughts and ideas. 😊",
},

};

// Display names for the autocomplete (preserves "Sir" / "Ma'am" etc.)
export const allNames: string[] = Object.values(messages)
  .map((m) => m.name)
  .sort((a, b) => a.localeCompare(b));


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
      "Please type your first name in the text field. If your name is still not listed, that's completely fine too 😊",
    thanks: "For every shared smile in a long hallway.",
    wish: "May the next chapter of your story be your best yet.",
  };
}

export function getUnlockTime(): Date {
  const stored = typeof window !== "undefined" ? localStorage.getItem("unlock_override") : null;
  if (stored) return new Date(stored);
  const d = new Date('06/12/2026');
  d.setHours(19, 0, 0, 0);
  return d;
}
