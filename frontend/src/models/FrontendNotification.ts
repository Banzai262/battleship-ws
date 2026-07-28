import type {NotificationType} from "../types/NotificationType.ts";

export interface FrontendNotification {
    id: number;
    message: string;
    type: NotificationType;
}
