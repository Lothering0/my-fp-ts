import * as C from "./Contravariant"
import { HKT } from "./HKT"
import { overload } from "../utils/overloads"
import { flow } from "../utils/flow"

export interface Show<A> {
  readonly show: (a: A) => string
}

export interface ShowHKT extends HKT {
  readonly type: Show<this["_A"]>
}

export const Contravariant: C.Contravariant<ShowHKT> = {
  contramap: overload (
    1,
    <A, B>(self: Show<A>, ba: (b: B) => A): Show<B> => ({
      show: flow (ba, self.show),
    }),
  ),
}
