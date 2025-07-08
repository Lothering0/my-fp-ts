import { Show } from "../../types/Show"
import { join } from "./utils"
import { flow } from "../../utils/flow"
import { map } from "./functor"

export const getShow: {
  <A>(S: Show<A>): Show<A[]>
} = S => ({
  show: flow (map (S.show), join (", "), x => `[${x}]`),
})
