import { Semigroup } from '../../typeclasses/Semigroup'
import { Effect, fromOperation } from './effect'

export const getRaceSemigroup: {
  <A, E>(): Semigroup<Effect<A, E>>
} = () => ({
  combine: my => mx => fromOperation(() => Promise.race([mx.run(), my.run()])),
})
