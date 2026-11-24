// All player-facing UI strings live here. t(key, vars) fills {name}. A pseudo-locale (?pseudo=1) expands and accents every string
// to test long and translated copy. There is no real second language yet (Georgian needs a font and a human translator).
const EN = {
  appName: 'Timehunt',
  dialLegend: 'Which year is it? Choose any year from {lo} to {hi}.', dialEmpty: 'Choose a year', dialHint: 'Drag along the ruler, tap it, or use the buttons.', dialSteps: 'Move the year', back5: 'Back 5 years', back1: 'Back 1 year', fwd1: 'Forward 1 year', fwd5: 'Forward 5 years',
  rangeLine: 'The year is somewhere from {lo} to {hi}.', evidenceLead: 'Each clue is true on 31 December of the hidden year. Work out what they rule out.',
  tagline: 'A historical deduction game',
  loading: "Loading today's cases",
  draftBanner: 'Draft pack, not publishable. Sample content for testing.',
  offline: 'You are offline. You can keep playing. Sources open when you are back online.',
  updateReady: 'A new version is ready. It will load the next time you open the app.',
  unsaved: 'Progress cannot be saved in this browser mode.',
  resumeBanner: 'Welcome back. You are on case {n} of 10.',
  navToday: 'Today', navPractice: 'Practice', navArchive: 'Archive', navSettings: 'Settings',
  caseOf: 'Case {n} of 10', insightOf: 'Insight {n} of {total}', dayStrip: 'The day, ten cases',
  stripSummary: 'The day so far: {solved} solved, {missed} missed, {todo} still to come. Now on case {now}.',
  stSolved: 'solved', stAssisted: 'solved with help', stMissed: 'missed', stNext: 'next', stTodo: 'to come', stOpen: 'open',
  trailTitle: 'The Daily Ten', trailLead: 'Ten cases. One hidden year in each. Eight Insight for the whole day.',
  startCase: 'Start case {n}', resumeCase: 'Continue case {n}', seeDay: 'See your day', howItWorks: 'How it works',
  onb1t: 'Read, then choose', onb1: 'Each case hides one year. Reading the evidence is free. It rules some years out.',
  onb2t: 'Eight Insight, shared', onb2: 'You have 8 Insight for all ten cases. It never refills. Spend 1 or 2 to reveal an extra clue. A clue that tells you nothing new costs nothing.',
  onb3t: 'One Lock per case', onb3: 'Lock a year. If you are wrong you see the answer and the day goes on. Every clue is true on 31 December of the hidden year.',
  next: 'Next', skip: 'Skip', done: 'Start playing', stepOf: 'Step {n} of 3',
  readEvidence: 'Choose a year', evidenceTitle: 'Evidence', notes: 'Notes', extraClues: 'Extra clues',
  rereadNotes: 'Re-read the {n} notes', yearsFreeLine: '{n} possible years', yearsLeft: '{n} possible years left',
  chooseYear: 'Choose a year. {n} are possible.', ruledFree: '{range} ruled out by free evidence', ruledClue: 'ruled out by a clue you bought',
  selected: 'Selected', pressSelect: 'Press to select',
  typeYear: 'Type a year instead', typeYearLabel: 'Year (for example 1920, or 2 CE)', useYear: 'Use this year',
  badYear: 'That year is outside this case. Choose a year in the range.',
  evidenceBtn: 'Evidence', lockBtn: 'Lock {year}', chooseFirst: 'Choose a year first.',
  backToYears: 'Back to the years',
  nudge: 'Nudge', deep: 'Deep clue', reveal: 'Reveal, {cost} Insight', revealed: 'Revealed',
  notEnough: 'Not enough Insight', zeroInsight: 'You have no Insight left. Reading and locking are still free.',
  noNew: 'A clue that tells you nothing new costs nothing.',
  confirmLockT: 'Lock {year}?', confirmLock: 'You have one Lock in this case. If you are wrong, you see the answer and the day goes on.',
  confirmLockYes: 'Lock {year}', keepChoosing: 'Keep choosing',
  confirmRevealT: 'Reveal this clue?', confirmReveal: '{category} ({tier}) costs {cost} Insight. You will have {left} left.',
  confirmRevealYes: 'Reveal for {cost}', cancel: 'Cancel',
  spent: 'Revealed. {n} Insight spent.', free: 'Revealed. It told you nothing new, so it cost nothing.',
  solvedT: 'Solved: {year}', missedT: 'Missed. The answer is {year}.', youLocked: 'You locked {year}.',
  whyNot: 'Why not the others', nextCase: 'Next case', worldAround: 'The world around {year}',
  sources: 'Sources ({n})', opened: 'Opened by the editor', notOpened: 'Not opened',
  missNote: 'A miss never ends your day.',
  dayDone: '{solved} of {total} solved. {left} Insight left.', dayDoneSub: '{clean} with no Insight, {assisted} with help, {missed} missed.',
  shareTitle: 'Share (no answers)', copy: 'Copy', copied: 'Copied',
  revealTitle: 'World Reveal (prototype)', revealNote: 'Entry and return path only. The full World Reveal is built in a later stage.',
  back: 'Back', toDay: 'Back to your day',
  practiceTitle: 'Practice', practiceLead: 'One case at a time, 2 Insight, saved separately. Practice never changes your day.',
  practiceRandom: 'Pick one for me', practiceSeed: 'Seed', practiceCase: 'Practice case {n}',
  archiveTitle: 'Archive', archiveEmpty: 'No finished days yet. Finish a day and it appears here, on this device.', archiveRow: '{solved} of {total} solved, {left} Insight left',
  settingsTitle: 'Settings', textSize: 'Text size', size100: 'Standard', size130: 'Large', size160: 'Larger', size200: 'Largest',
  reduceMotion: 'Reduce motion', showGuide: 'Show the squirrel guide', confirmSpend: 'Ask before spending Insight', clearData: 'Delete saved games and settings', clearConfirmT: 'Delete everything saved?',
  clearConfirm: 'This removes your day, practice games, archive and settings from this device. It cannot be undone.', clearYes: 'Delete', language: 'Language', langEn: 'English',
  langNote: 'Other languages are not available yet.',
  heldTitle: 'Saved game on hold', heldBody: 'Your saved record has not been touched. If you start again, the old record is kept under a backup key.',
  held_corrupt: 'The saved game could not be read, or it was changed outside the game.', held_schema_unknown: 'The saved game was made by a different version of this app.',
  held_content_changed: "Today's cases changed since you started. Your saved progress belongs to the earlier version.", held_rules_changed: 'The rules changed since you started. Your saved progress belongs to the earlier rules.',
  startNew: 'Start a new expedition',
  errPack: "Today's pack failed validation and was not loaded", errLoad: 'The pack could not be loaded', errNothing: 'Nothing was started and no progress was changed.',
  saveFailed: 'Could not save. Nothing was charged.',
  traceTitle: 'Trace (test variant)', traceLabel: 'Compare with year', traceBtn: 'Trace for {cost} Insight', traceResult: '{year}: the answer is {r}',
  rEarlier: 'earlier', rLater: 'later', rSame: 'that year',
  conv: 'Every clue is true on 31 December of the hidden year.',
};
let pseudo = false;
export function setPseudo(on) { pseudo = !!on; }
const MAP = { a: 'à', e: 'é', i: 'ï', o: 'ô', u: 'ü', A: 'Å', E: 'É', I: 'Î', O: 'Ö', U: 'Û', c: 'ç', n: 'ñ', y: 'ý', s: 'š' };
function pseudoize(s) {
  const out = s.replace(/\{[a-z]+\}|./g, ch => (ch.length > 1 ? ch : MAP[ch] || ch));
  const pad = ' ' + 'xx'.repeat(Math.ceil(s.replace(/\{[a-z]+\}/g, '').length * 0.4 / 2));
  return '[' + out + pad.replace(/x/g, '~') + ']';
}
export function t(key, vars = {}) {
  let s = EN[key];
  if (s === undefined) return '??' + key;
  if (pseudo) s = pseudoize(s);
  return s.replace(/\{([a-zA-Z]+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : '{' + k + '}'));
}
export const KEYS = Object.keys(EN);
