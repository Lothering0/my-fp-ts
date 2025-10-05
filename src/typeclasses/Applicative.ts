import { Hkt, Kind } from './Hkt'
import { Functor } from './Functor'
import { FromIdentity } from './FromIdentity'
import { Monad } from './Monad'
import { pipe } from '../utils/flow'
import { Semigroup } from './Semigroup'
import { Monoid } from './Monoid'

export interface Applicative<F extends Hkt>
  extends FromIdentity<F>,
    Functor<F> {
  readonly apply: <In, Collectable1, Fixed>(
    fa: Kind<F, In, Collectable1, Fixed>,
  ) => <Out, Collectable2>(
    self: Kind<F, (a: In) => Out, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
  readonly flipApply: <In, Out, Collectable1, Fixed>(
    fab: Kind<F, (a: In) => Out, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, Out, Collectable1 | Collectable2, Fixed>
}

export const create = <F extends Hkt>(Monad: Monad<F>): Applicative<F> => {
  const apply: Applicative<F>['apply'] = fa => self =>
    pipe(
      Monad.Do,
      Monad.bind('f', self),
      Monad.bind('a', fa),
      Monad.map(({ f, a }) => f(a)),
    )

  const flipApply: Applicative<F>['flipApply'] = self => fa =>
    pipe(
      Monad.Do,
      Monad.bind('a', fa),
      Monad.bind('f', self),
      Monad.map(({ f, a }) => f(a)),
    )

  return {
    of: Monad.of,
    map: Monad.map,
    apply,
    flipApply,
  }
}

export const getApplicativeSemigroup: {
  <F extends Hkt>(
    Applicative: Applicative<F>,
  ): <A, E, S>(Semigroup: Semigroup<A>) => Semigroup<Kind<F, A, E, S>>
} = Applicative => Semigroup => ({
  combine: y => x =>
    pipe(y, Applicative.map(Semigroup.combine), Applicative.apply(x)),
})

export const getApplicativeMonoid: {
  <F extends Hkt>(
    Applicative: Applicative<F>,
  ): <A, E, S>(Monoid: Monoid<A>) => Monoid<Kind<F, A, E, S>>
} = Applicative => Monoid => ({
  ...getApplicativeSemigroup(Applicative)(Monoid),
  empty: Applicative.of(Monoid.empty),
})
