import { Monoid } from '../../typeclasses/Monoid'
import { getRaceSemigroup } from './semigroup'
import { Effect, fromAsync } from './effect'
import { succeed } from '../Result'
import { _ } from '../../utils/underscore'

export const empty: Effect<never, never> = fromAsync(
  () => new Promise(() => succeed(_)),
)

export const getRaceMonoid: {
  <A, E, R>(): Monoid<Effect<A, E, R>>
} = () => ({
  ...getRaceSemigroup(),
  empty,
})
