import { Hkt, Kind } from './Hkt'
import { TypeClass } from './TypeClass'

export interface Contravariant<F extends Hkt> extends TypeClass<F> {
  readonly contramap: <Fixed1, Fixed2>(
    ts: (s: Fixed2) => Fixed1,
  ) => <In, Collectable>(
    self: Kind<F, In, Collectable, Fixed1>,
  ) => Kind<F, In, Collectable, Fixed2>
}
