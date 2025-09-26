import { Hkt } from '../../typeclasses/Hkt'

export interface ReadonlyRecordHkt extends Hkt {
  readonly Type: ReadonlyRecord<
    this['Fixed'] extends string ? this['Fixed'] : string,
    this['In']
  >
}

export type ReadonlyRecord<S extends string, A> = Readonly<Record<S, A>>
