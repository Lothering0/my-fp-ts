import { Show } from "../../types/Show"
import { Result } from "./result"
import { match } from "./utils"
import { flow } from "../../utils/flow"

export const getShow: {
  <E, A>(SE: Show<E>, SA: Show<A>): Show<Result<E, A>>
} = (SE, SA) => ({
  show: match (
    flow (SE.show, e => `failure (${e})`),
    flow (SA.show, a => `success (${a})`),
  ),
})
