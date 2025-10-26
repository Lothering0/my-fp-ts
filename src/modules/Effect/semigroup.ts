import { Semigroup } from '../../typeclasses/Semigroup'
import { Effect, fromOperation, run } from './effect'

export const getRaceSemigroup: {
  <A, E>(): Semigroup<Effect<A, E>>
} = () => ({
  combine: my => mx => fromOperation(() => Promise.race([run(mx), run(my)])),
})
