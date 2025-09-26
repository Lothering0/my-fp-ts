import * as contravariant from "./Contravariant"
import { Hkt } from "./Hkt"
import { flow } from "../utils/flow"

export interface Show<In> {
  readonly show: (a: In) => string
}

export interface ShowHkt extends Hkt {
  readonly Type: Show<this["In"]>
}

export const Contravariant: contravariant.Contravariant<ShowHkt> = {
  contramap: ba => self => ({
    show: flow (ba, self.show),
  }),
}
