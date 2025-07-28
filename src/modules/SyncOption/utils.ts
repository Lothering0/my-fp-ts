import * as option from "../Option"
import { flow } from "../../utils/flow"
import { LazyArg } from "../../types/utils"
import { execute, SyncOption } from "./sync-option"

export const match: {
  <A, B, C = B>(
    onNone: LazyArg<B>,
    onSome: (a: A) => C,
  ): (self: SyncOption<A>) => B | C
} = (onNone, onSome) => flow (execute, option.match (onNone, onSome))
