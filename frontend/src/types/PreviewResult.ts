import type {Coordinate} from "./Coordinate.ts";

export interface PreviewResult {
    positions: Coordinate[];
    valid: boolean;
}