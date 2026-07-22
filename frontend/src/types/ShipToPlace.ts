import type {ShipStatus} from "../models/ShipStatus.ts";

export interface ShipToPlace {
    ship: ShipStatus;
    row: number;
    col: number;
    horizontal: boolean;
}