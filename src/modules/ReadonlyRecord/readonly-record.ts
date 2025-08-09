import { Hkt } from "../../types/Hkt"

export interface ReadonlyRecordHkt extends Hkt {
  readonly type: ReadonlyRecord<
    this["_S"] extends string ? this["_S"] : never,
    this["_A"]
  >
}

export type ReadonlyRecord<S extends string, A> = Readonly<Record<S, A>>
