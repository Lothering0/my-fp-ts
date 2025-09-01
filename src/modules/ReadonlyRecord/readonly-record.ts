import { Hkt } from "../../typeclasses/Hkt"

export interface ReadonlyRecordHkt extends Hkt {
  readonly type: ReadonlyRecord<
    this["_fixed"] extends string ? this["_fixed"] : string,
    this["_in"]
  >
}

export type ReadonlyRecord<S extends string, A> = Readonly<Record<S, A>>
