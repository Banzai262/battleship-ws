export enum ShotOutcome {
    HIT = 'hit',
    MISS = 'miss',
    SUNK = "sunk"
}

export function ShotOutcomeMap(shot?: ShotOutcome): string {
    switch (shot) {
        case ShotOutcome.HIT:
            return "🔴 Hit"
        case ShotOutcome.MISS:
            return "⚪ Miss";
        case ShotOutcome.SUNK:
            return "💥 Sunk";
        default:
            return "-"
    }
}