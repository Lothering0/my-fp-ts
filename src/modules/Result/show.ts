import { Show } from "../../types/Show"
import { Result } from "./result"
import { match } from "./utils"
import { flow } from "../../utils/flow"

export const getShow: {
  <E, A>(ShowE: Show<E>, ShowA: Show<A>): Show<Result<E, A>>
} = (ShowE, ShowA) => ({
  show: match (
    flow (ShowE.show, e => `failure (${e})`),
    flow (ShowA.show, a => `success (${a})`),
  ),
})
