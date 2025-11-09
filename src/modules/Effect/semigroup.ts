import { Semigroup } from '../../typeclasses/Semigroup'
import { Effect, fromReader, run } from './effect'

export const getRaceSemigroup: {
  <A, E, R>(): Semigroup<Effect<A, E, R>>
} = () => ({
  combine: my => mx => fromReader(r => Promise.race([run(r)(mx), run(r)(my)])),
})
