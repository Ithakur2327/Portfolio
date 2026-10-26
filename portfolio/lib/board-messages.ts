/**
 * Quotes shown on the split-flap board (see components/QuoteBoard.tsx).
 *
 * The board is 22 columns × 6 rows. Use "\n" to break lines (each line ≤ 22
 * characters); text is centred automatically. Only these characters exist on
 * the flaps — anything else becomes a blank:
 *   A-Z 0-9 ! @ # $ ( ) - + & = ; : ' " % , . / ? °
 * Colour tiles: {R} {O} {Y} {G} {B} {V} {W}
 */
export const BOARD_MESSAGES: string[] = [
  `TALK IS CHEAP.\nSHOW ME THE CODE.`,
  `MAKE IT WORK.\nMAKE IT RIGHT.\nMAKE IT FAST.`,
  `PREMATURE\nOPTIMIZATION IS THE\nROOT OF ALL EVIL.`,
  `THE BEST WAY TO\nPREDICT THE FUTURE\nIS TO INVENT IT.`,
  `FIRST, SOLVE THE\nPROBLEM. THEN,\nWRITE THE CODE.`,
  `STAY HUNGRY.\nSTAY FOOLISH.`,
  `SIMPLICITY IS A\nPREREQUISITE FOR\nRELIABILITY.`,
  `PROGRAMS MUST BE\nWRITTEN FOR PEOPLE\nTO READ.`,
];