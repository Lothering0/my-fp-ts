import { Sync } from '../modules/Sync'
import { pipe } from '../utils/flow'
import { Hkt, Kind } from './Hkt'
import { Monad } from './Monad'
import { TypeClass } from './TypeClass'

export interface Tappable<F extends Hkt> extends TypeClass<F> {
  readonly tap: <In, Collectable1, Fixed>(
    f: (a: In) => Kind<F, unknown, Collectable1, Fixed>,
  ) => <Collectable2>(
    self: Kind<F, In, Collectable2, Fixed>,
  ) => Kind<F, In, Collectable1 | Collectable2, Fixed>

  readonly tapSync: <In>(
    f: (a: In) => Sync<unknown>,
  ) => <Collectable, Fixed>(
    self: Kind<F, In, Collectable, Fixed>,
  ) => Kind<F, In, Collectable, Fixed>
}

export const create: {
  <F extends Hkt>(Monad: Monad<F>): Tappable<F>
} = Monad => ({
  tap: f => self =>
    pipe(
      Monad.Do,
      Monad.apS('a', self),
      Monad.flatMap(({ a }) =>
        pipe(
          a,
          f,
          Monad.flatMap(() => Monad.of(a)),
        ),
      ),
    ),
  tapSync: f => self =>
    pipe(
      Monad.Do,
      Monad.apS('a', self),
      Monad.map(({ a }) =>
        pipe(
          a,
          f,
          sync => sync(), // From `Sync`
          () => a,
        ),
      ),
    ),
})
