import {Coord} from "./Coord";

export type SimulationFieldResponse = {
    id: string
    field: FieldWithoutId[]
}

export type FieldWithoutId = {
    survivors: Coord[]
}