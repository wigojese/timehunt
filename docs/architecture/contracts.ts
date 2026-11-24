// Typed API contracts for the production build (Stage 10). They describe what the gray-box already does in JavaScript,
// so the engine can move to TypeScript without a behaviour change. Checked with `npm run typecheck` (tsc 6.0.3, strict).
// Years are astronomical integers: 1 BCE = 0, no year zero is ever displayed.

export type Year = number;
export type CaseId = string;
export type SourceId = string;
export type VerificationLevel = 'V0' | 'V1' | 'V2' | 'V3';
export type Tier = 'nudge' | 'deep';

// ---------- content ----------
export interface Source { id: SourceId; title: string; publisher: string; url: string; kind: string; opened: boolean; retrieved: string; note: string }
export type Predicate =
  | { op: 'gte'; year: Year }
  | { op: 'lte'; year: Year }
  | { op: 'equals'; year: Year; rule?: 'anchor_year_plus_n' | 'era_year'; anchor_year?: Year; era_start?: Year; n?: number };
export interface Anchor { label: string; date: string; year: Year; year_label: string; region: string }
export interface FreeClue { id: string; kind: 'bound' | 'relation'; text: string; anchor: Anchor; predicate: Predicate; convention: 'end-of-year' | 'calendar-year-arithmetic'; source_ids: SourceId[]; corroboration_ids: SourceId[]; editor_note?: string }
export interface PaidClue { id: string; tier: Tier; category: string; text: string; anchor: Anchor; predicate: Predicate; source_ids: SourceId[]; corroboration_ids: SourceId[] }
export interface RevealItem { form: string; title: string; text: string; sources: SourceId[] }
export interface CaseRecord {
  id: CaseId; order: number; title: string; lens: string; region: string[]; era: string; question: string; corridor: [Year, Year];
  target: { year: Year; event: string; definition: string; precision: string; calendar: string; discovery_vs_event: string };
  free: FreeClue[]; paid: PaidClue[]; context_free: { text: string; sources: SourceId[] }[]; reveal: RevealItem[];
  editorial: { c0: Year[]; uniqueness_proof: Record<string, string>; blockers: string[]; publishable: boolean; hold: string[]; sample_player: string[]; miss_explanation: string };
}
export interface PackFile { pack_id: string; version: string; status: 'DRAFT_NOT_PUBLISHABLE' | 'REVIEW' | 'PUBLISHABLE'; date_convention: 'end-of-year'; sources: Source[]; cases: CaseRecord[]; connections: { after_case: number; title: string; text: string }[]; finale_thesis: string }
export interface ValidationIssue { code: string; path: string; msg: string }
export interface CompiledCase { id: CaseId; order: number; title: string; lens: string; question: string; corridor: [Year, Year]; target: Year; c0: Year[]; clues: { id: string; tier: Tier; category: string; text: string; predicate: Predicate; sourceIds: SourceId[] }[]; relation: { id: string; text: string; sourceIds: SourceId[] } | null }
export interface CompiledPack { packId: string; version: string; status: PackFile['status']; digest: string; cases: CompiledCase[]; sources: Record<SourceId, Source> }
/** Never throws. A failed validation returns no content, so an invalid pack cannot be played. */
export type ValidatePack = (raw: unknown, opts?: { allowDraft?: boolean }) => { ok: true; errors: []; warnings: ValidationIssue[]; content: CompiledPack } | { ok: false; errors: ValidationIssue[]; warnings: ValidationIssue[]; content: null };

// ---------- rules ----------
export interface Rules { readonly id: string; readonly version: string; readonly insight: number; readonly costs: Readonly<Record<Tier, number>>; readonly refundRedundant: boolean; readonly perCaseCap: number | null; readonly trace: Readonly<{ enabled: boolean; cost: number }>; readonly relationTier: 'free' | 'deep'; readonly practiceInsight: number; readonly showRuledOut: boolean }

// ---------- engine ----------
export type CaseStatus = 'not_started' | 'active' | 'solved_clean' | 'solved_assisted' | 'missed';
export interface CaseState { id: CaseId; status: CaseStatus; C: Year[]; revealed: string[]; spent: number; lock: { year: Year; correct: boolean } | null; trace: { year: Year; result: 'earlier' | 'later' | 'same' }[] }
export interface ExpeditionState { schema: 1; dailyId: string; mode: 'daily' | 'practice'; packDigest: string; rulesId: string; insightInitial: number; insight: number; cursor: number; status: 'active' | 'completed'; cases: CaseState[]; applied: string[]; log: Command[] }
export type Command =
  | { type: 'REVEAL'; caseId: CaseId; clueId: string; actionId: string }
  | { type: 'TRACE'; caseId: CaseId; year: Year; actionId: string }
  | { type: 'LOCK'; caseId: CaseId; year: Year; actionId: string }
  | { type: 'ADVANCE'; caseId: CaseId; actionId: string };
export type ErrorCode = 'BAD_COMMAND' | 'NO_ACTION_ID' | 'EXPEDITION_OVER' | 'NOT_CURRENT_CASE' | 'CASE_RESOLVED' | 'UNKNOWN_CLUE' | 'ALREADY_REVEALED' | 'INSUFFICIENT_INSIGHT' | 'CASE_CAP' | 'INVARIANT' | 'TRACE_DISABLED' | 'TRACE_UNINFORMATIVE' | 'BAD_YEAR' | 'OUT_OF_RANGE' | 'NOT_RESOLVED' | 'UNKNOWN_COMMAND';
export type GameEvent =
  | { type: 'CLUE_REVEALED'; clueId: string; charged: number; refunded: number; removed: Year[]; insight: number }
  | { type: 'TRACED'; year: Year; result: 'earlier' | 'later' | 'same'; charged: number; insight: number }
  | { type: 'LOCKED'; year: Year; correct: boolean; status: CaseStatus }
  | { type: 'CASE_OPENED'; caseId: CaseId }
  | { type: 'EXPEDITION_COMPLETED' }
  | { type: 'DUPLICATE_IGNORED'; actionId: string };
/** Pure. A refused command returns the SAME state object and an error; a repeated actionId is idempotent. */
export type Transition = (state: Readonly<ExpeditionState>, cmd: Command, content: CompiledPack, rules: Rules) => { next: ExpeditionState; events: GameEvent[]; error: { code: ErrorCode; message: string } | null };
export interface PublicCaseView { id: CaseId; order: number; status: CaseStatus; title?: string; lens?: string; question?: string; corridor?: [Year, Year]; candidates?: Year[]; freeCandidates?: Year[]; spent?: number; clues?: { id: string; tier: Tier; cost: number; category: string; revealed: boolean; text?: string; sourceIds?: SourceId[] }[]; resolution?: { answer: Year; event: string; definition: string; proof: Record<string, string>; reveal: { title: string; text: string; sourceIds: SourceId[] }[] } }
/** The only thing a renderer may read. It never contains the target or unrevealed clue text before a case is resolved. */
export type PublicView = (state: Readonly<ExpeditionState>, content: CompiledPack, rules: Rules) => { dailyId: string; mode: 'daily' | 'practice'; status: ExpeditionState['status']; insight: number; insightInitial: number; cursor: number; cases: PublicCaseView[] };

// ---------- persistence ----------
export interface KeyValueStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; removeItem(key: string): void }
export type LoadStatus = 'fresh' | 'fresh_unsaved' | 'resumed' | 'corrupt' | 'schema_unknown' | 'content_changed' | 'rules_changed';
export interface SavedRecord { schema: number; packDigest: string; rulesId: string; stateDigest: string; state: ExpeditionState }
export interface SessionApi {
  /** Never throws. A held status keeps the old record untouched. */
  load(): LoadStatus;
  /** The player's explicit choice; the old record is kept under `.previous`. */
  discardAndStart(): LoadStatus;
  /** Computes next state, writes ONE record, and only then adopts it. If the write throws, re-reads the store to learn the truth. */
  dispatch(cmd: Command): { ok: boolean; error: { code: ErrorCode | 'SAVE_FAILED' | 'NO_STATE'; message: string } | null; events: GameEvent[]; saved?: boolean; recovered?: boolean };
  readonly state: ExpeditionState | null;
}
/** Migrations are pure functions from schema n to n+1. An unknown newer schema is held, never guessed at. */
export type Migration = { from: number; to: number; up(record: unknown): SavedRecord };

// ---------- content delivery ----------
export interface PackManifest { packId: string; version: string; digest: string; publishedAt: string; resetZone: 'UTC'; url: string; signature?: string }
export interface PackRepository { latest(): Promise<PackManifest>; fetch(manifest: PackManifest): Promise<unknown>; cached(): Promise<PackManifest[]> }
