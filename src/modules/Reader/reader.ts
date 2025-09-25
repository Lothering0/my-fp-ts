import { Hkt } from "../../typeclasses/Hkt"

export interface ReaderHkt extends Hkt {
  readonly type: Reader<this["_fixed"], this["_in"]>
}

export interface ReaderCollectableHkt extends Hkt {
  readonly type: Reader<this["_collectable"], this["_in"]>
}

export interface Reader<R, A> {
  (r: R): A
}
