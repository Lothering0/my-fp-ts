import { Show } from '../../typeclasses/Show'
import { Result } from './result'
import { match } from './matchers'
import { flow } from '../../utils/flow'

export const getShow: {
  <A, E>(ShowA: Show<A>, ShowE: Show<E>): Show<Result<A, E>>
} = (ShowA, ShowE) => ({
  show: match({
    onSuccess: flow(ShowA.show, a => `success(${a})`),
    onFailure: flow(ShowE.show, e => `failure(${e})`),
  }),
})
