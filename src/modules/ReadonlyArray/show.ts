import { Show } from "../../typeclasses/Show"
import { join } from "./utils"
import { flow } from "../../utils/flow"
import { map } from "./functor"

export const getShow: {
  <A>(Show: Show<A>): Show<ReadonlyArray<A>>
} = Show => ({
  show: flow (map (Show.show), join (", "), x => `[${x}]`),
})
