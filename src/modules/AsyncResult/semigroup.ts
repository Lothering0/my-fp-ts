import { Semigroup } from '../../typeclasses/Semigroup'
import { AsyncResult, toPromise } from './async-result'

export const getRaceSemigroup: {
  <A, E>(): Semigroup<AsyncResult<A, E>>
} = () => ({
  combine: y => x => () => Promise.race([toPromise(x), toPromise(y)]),
})
