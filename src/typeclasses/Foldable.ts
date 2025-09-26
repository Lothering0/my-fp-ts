import { Hkt, Kind } from './Hkt'
import { TypeClass } from './TypeClass'

export interface Foldable<F extends Hkt> extends TypeClass<F> {
  readonly reduce: <In, Out>(
    b: Out,
    bab: (b: Out, a: In) => Out,
  ) => <Collectable, Fixed>(self: Kind<F, In, Collectable, Fixed>) => Out

  readonly reduceRight: <In, Out>(
    b: Out,
    abb: (a: In, b: Out) => Out,
  ) => <Collectable, Fixed>(self: Kind<F, In, Collectable, Fixed>) => Out
}
