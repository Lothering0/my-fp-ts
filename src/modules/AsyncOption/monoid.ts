import { AsyncOption } from './async-option'
import { some } from '../Option'
import { Monoid } from '../../typeclasses/Monoid'
import { _ } from '../../utils/underscore'
import { getRaceSemigroup } from './semigroup'

export const empty: AsyncOption<never> = () => new Promise(() => some(_))

export const getRaceMonoid: {
  <A>(): Monoid<AsyncOption<A>>
} = () => ({
  ...getRaceSemigroup(),
  empty,
})
