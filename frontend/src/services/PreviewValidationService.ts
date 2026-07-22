import type {Coordinate} from "../types/Coordinate.ts";
import type {ShipToPlace} from "../types/ShipToPlace.ts";
import type {PreviewResult} from "../types/PreviewResult.ts";
import type {ShipStatus} from "../models/ShipStatus.ts";

export class PreviewValidationService {
    public getPreview(
        placements: ShipToPlace[],
        row: number | undefined,
        col: number | undefined,
        horizontal: boolean,
        ship: ShipStatus | null
    ): PreviewResult {
        if ((!row && row !== 0) || (!col && col !== 0) || !ship) {
            return {
                positions: [],
                valid: false
            };
        }

        const occupied = this.computeOccupiedCells(placements);
        const positions = this.#computePositions(row, col, horizontal, ship.size);
        const valid = this.#isPreviewValid(positions, occupied);

        return {
            positions: positions,
            valid: valid,
        };
    }

    public computeOccupiedCells(placements: ShipToPlace[]): Coordinate[] {
        return placements.flatMap(p => this.#computePositions(p.row, p.col, p.horizontal, p.ship.size));
    }

    #isPreviewValid(positions: Coordinate[], occupied: Coordinate[]): boolean {
        // fits on board?
        if (positions.some(p =>
            // row
            p[0] < 0 || p[0] >= 10 ||
            // col
            p[1] < 0 || p[1] >= 10
        )) {
            return false;
        }

        // overlap?
        return !positions.some(p => occupied.some(o => o[0] === p[0] && o[1] === p[1]));
    }

    #computePositions(
        row: number,
        col: number,
        horizontal: boolean,
        shipSize: number
    ): Coordinate[] {
        const positions: Coordinate[] = [];

        for (let i = 0; i < shipSize; i++) {
            positions.push([
                horizontal ? row : row + i,
                horizontal ? col + i : col,
            ]);
        }

        return positions;
    }
}

/*

permet de faire ceci

peut colorer en fonction du résultat

tout part de placements

const occupied = service.computeOccupiedCells(placements);

const preview = service.computePositions(...);

const valid = service.isPreviewValid(preview, occupied);

 */