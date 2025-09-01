import { Show } from "../../typeclasses/Show"
import { left, right, Separated } from "./separated"
import { pipe } from "../../utils/flow"

export const getShow: {
  <E, A>(SE: Show<E>, SA: Show<A>): Show<Separated<E, A>>
} = (SE, SA) => ({
  show: self =>
    `make (${pipe (self, left, SE.show)}, ${pipe (self, right, SA.show)})`,
})
