import { AsyncOption, toPromise } from './async-option'
import { Semigroup } from '../../typeclasses/Semigroup'

export const getRaceSemigroup: {
  <A>(): Semigroup<AsyncOption<A>>
} = () => ({
  combine: y => x => () => Promise.race([toPromise(x), toPromise(y)]),
})
