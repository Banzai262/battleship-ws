import type {LogKind} from "../types/LogKind.ts";

export interface LogEvent extends Response {
    kind: LogKind;
    message: string;
}
