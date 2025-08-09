import * as contravariant from "./Contravariant"
import { Hkt } from "./Hkt"
import { flow } from "../utils/flow"

export interface Show<A> {
  readonly show: (a: A) => string
}

export interface ShowHkt extends Hkt {
  readonly type: Show<this["_A"]>
}

export const Contravariant: contravariant.Contravariant<ShowHkt> = {
  contramap: ba => self => ({
    show: flow (ba, self.show),
  }),
}
