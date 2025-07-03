import { HKT } from "../../types/HKT"

export interface ArrayHKT extends HKT {
  readonly type: Array<this["_A"]>
}

export declare const _F: ArrayHKT
