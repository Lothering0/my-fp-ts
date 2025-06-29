import { HKT } from "./HKT"

export interface TypeClass<F extends HKT> {
  readonly _F?: F
}
