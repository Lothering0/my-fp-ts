import { Hkt, Kind } from './Hkt'
import { TypeClass } from './TypeClass'

export interface Invariant<F extends Hkt> extends TypeClass<F> {
  readonly imap: <Fixed1, Fixed2>(
    st: (s: Fixed1) => Fixed2,
    ts: (t: Fixed2) => Fixed1,
  ) => <In, Collectable>(
    self: Kind<F, In, Collectable, Fixed1>,
  ) => Kind<F, In, Collectable, Fixed2>
}
