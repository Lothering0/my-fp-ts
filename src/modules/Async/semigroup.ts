import { Semigroup } from '../../typeclasses/Semigroup'
import { Async, toPromise } from './async'

export const getRaceSemigroup: {
  <Fixed>(): Semigroup<Async<Fixed>>
} = () => ({
  combine: y => x => () => Promise.race([toPromise(x), toPromise(y)]),
})
