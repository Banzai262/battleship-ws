import type {Coordinate} from "../types/Coordinate.ts";

export interface ShipStatus {
    name: string;
    size: number;
    placed: boolean;
    sunk: boolean;
    positions: Coordinate[];
    hits: Coordinate[];
    health: number; // TODO plus tard peut-être, quoique avec le size et la taille de hits on peut savoir
}