import { Semigroup } from '../../typeclasses/Semigroup'
import { AsyncResult, toPromise } from './async-result'

export const getRaceSemigroup: {
  <Failure, In>(): Semigroup<AsyncResult<Failure, In>>
} = () => ({
  combine: y => x => () => Promise.race([toPromise(x), toPromise(y)]),
})
