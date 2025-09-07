import { Show } from "../../typeclasses/Show"
import { Result } from "./result"
import { match } from "./matchers"
import { flow } from "../../utils/flow"

export const getShow: {
  <E, A>(ShowE: Show<E>, ShowA: Show<A>): Show<Result<E, A>>
} = (ShowE, ShowA) => ({
  show: match ({
    onFailure: flow (ShowE.show, e => `failure (${e})`),
    onSuccess: flow (ShowA.show, a => `success (${a})`),
  }),
})
