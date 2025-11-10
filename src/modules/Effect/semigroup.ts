import { Semigroup } from '../../typeclasses/Semigroup'
import { Effect, fromReaderResult, run } from './effect'

export const getRaceSemigroup: {
  <A, E, R>(): Semigroup<Effect<A, E, R>>
} = () => ({
  combine: my => mx =>
    fromReaderResult(r => Promise.race([run(r)(mx), run(r)(my)])),
})
