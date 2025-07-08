import { NonEmptyArray } from "./non-empty-array"
import { join } from "../Array"
import { Show } from "../../types/Show"
import { flow } from "../../utils/flow"
import { map } from "./functor"

export const getShow: {
  <A>(S: Show<A>): Show<NonEmptyArray<A>>
} = S => ({
  show: flow (map (S.show), join (", "), x => `[${x}]`),
})
