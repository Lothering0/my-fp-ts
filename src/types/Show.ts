import * as contravariant from "./Contravariant"
import { HKT } from "./HKT"
import { flow } from "../utils/flow"

export interface Show<A> {
  readonly show: (a: A) => string
}

export interface ShowHKT extends HKT {
  readonly type: Show<this["_A"]>
}

export const Contravariant: contravariant.Contravariant<ShowHKT> = {
  contramap: ba => self => ({
    show: flow (ba, self.show),
  }),
}
