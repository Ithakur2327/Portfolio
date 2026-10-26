export type CodeTone = "keyword" | "name" | "string" | "function" | "comment" | "operator";

export interface CodeToken {
  text: string;
  tone?: CodeTone;
}

export type BoardMessage =
  | { type: "quote"; text: string }
  | { type: "code"; language: string; lines: CodeToken[][] }
  | { type: "puzzle"; question: string; answer: string };

export const BOARD_MESSAGES: BoardMessage[] = [
  {
    type: "code",
    language: "JavaScript",
    lines: [
      [{ text: "const ", tone: "keyword" }, { text: "life", tone: "name" }, { text: " = {" }],
      [{ text: "  mindset: " }, { text: '"Always curious"', tone: "string" }, { text: "," }],
      [{ text: "  strategy: " }, { text: '"Build > Talk"', tone: "string" }, { text: "," }],
      [{ text: "  status: " }, { text: '"Still evolving"', tone: "string" }],
      [{ text: "};" }],
    ],
  },
  {
    type: "code",
    language: "Python",
    lines: [
      [{ text: "while ", tone: "keyword" }, { text: "not ", tone: "keyword" }, { text: "successful:" }],
      [{ text: "    learn", tone: "function" }, { text: "()" }],
      [{ text: "    build", tone: "function" }, { text: "()" }],
      [{ text: "    fail", tone: "function" }, { text: "()" }],
      [{ text: "    improve", tone: "function" }, { text: "()" }],
    ],
  },
  {
    type: "code",
    language: "C",
    lines: [
      [{ text: "void ", tone: "keyword" }, { text: "work", tone: "function" }, { text: "() {" }],
      [{ text: "  while ", tone: "keyword" }, { text: "(true) {" }],
      [{ text: "    perform_your_duty", tone: "function" }, { text: "();" }],
      [{ text: "    // Control actions, not outcomes", tone: "comment" }],
      [{ text: "    release_expectations", tone: "function" }, { text: "();" }],
      [{ text: "  }" }],
      [{ text: "}" }],
    ],
  },
  { type: "quote", text: "ACT FULLY. RELEASE THE FRUIT." },
  { type: "quote", text: "STEADY IN JOY, STEADY IN LOSS." },
  { type: "quote", text: "MASTER THE MIND; BE FREE." },
  { type: "quote", text: "MEET ALL BEINGS WITH EQUAL EYES." },
  { type: "quote", text: "PEACE BEGINS WHEN WANTING ENDS." },
  { type: "puzzle", question: "What has keys but opens no locks?", answer: "A piano." },
  { type: "puzzle", question: "What gets wetter as it dries?", answer: "A towel." },
  { type: "puzzle", question: "What has cities, but no houses or people?", answer: "A map." },
];
