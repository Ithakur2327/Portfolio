/**
 * Messages shown on the split-flap board (see components/QuoteBoard.tsx).
 *
 * The board is 22 columns × 6 rows. Use "\n" to break lines (each line ≤ 22
 * characters); text is centred automatically. Only these characters exist on
 * the flaps — anything else becomes a blank:
 *   A-Z 0-9 ! @ # $ ( ) - + & = ; : ' " % , . / ? °
 * Colour tiles: {R} {O} {Y} {G} {B} {V} {W}
 */
export const BOARD_MESSAGES: string[] = [
  `"TALK IS CHEAP.\nSHOW ME THE CODE."\n\n- LINUS TORVALDS`,
  `MAKE IT WORK.\nMAKE IT RIGHT.\nMAKE IT FAST.\n\n- KENT BECK`,
  `{R}{O}{Y}{G}{B}{V}{W}\n\nHELLO, WORLD!\n\n{W}{V}{B}{G}{Y}{O}{R}`,
  `"PREMATURE\nOPTIMIZATION IS THE\nROOT OF ALL EVIL."\n\n- DONALD KNUTH`,
  `0.1 + 0.2\n= 0.30000000000000004\n\nNOT A BUG.\nJUST IEEE 754.`,
  `"THE BEST WAY TO\nPREDICT THE FUTURE\nIS TO INVENT IT."\n\n- ALAN KAY`,
  `THE FIRST COMPUTER\nBUG WAS A REAL MOTH.\nHARVARD MARK II, 1947.`,
  `"FIRST, SOLVE THE\nPROBLEM. THEN,\nWRITE THE CODE."\n\n- JOHN JOHNSON`,
  `ONLY 2 HARD THINGS\nIN COMPUTER SCIENCE:\nCACHE INVALIDATION\nAND NAMING THINGS.\n\n- PHIL KARLTON`,
  `"STAY HUNGRY.\nSTAY FOOLISH."\n\n- STEVE JOBS`,
  `"SIMPLICITY IS A\nPREREQUISITE FOR\nRELIABILITY."\n\n- E. W. DIJKSTRA`,
  `THE FIRST .COM EVER\nREGISTERED WAS\nSYMBOLICS.COM\nIN 1985.`,
  `"PROGRAMS MUST BE\nWRITTEN FOR PEOPLE\nTO READ."\n\n- ABELSON & SUSSMAN`,
  `BUILT WITH CODE,\nCOFFEE AND CURIOSITY.\n\nSHIP IT.`,
];