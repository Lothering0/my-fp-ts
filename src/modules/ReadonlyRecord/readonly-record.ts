import { Hkt as Hkt_ } from '../../typeclasses/Hkt'

export interface Hkt extends Hkt_ {
  readonly Type: ReadonlyRecord<
    this['Fixed'] extends string ? this['Fixed'] : string,
    this['In']
  >
}

export type ReadonlyRecord<S extends string, A> = Readonly<Record<S, A>>
