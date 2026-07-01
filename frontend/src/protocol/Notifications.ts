import type {Response} from "./MessageType.ts";

export interface Notification extends Response {
    message: string;
}