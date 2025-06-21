import { LazyArg } from "../types/utils"
import { _ } from "./underscore"

type Constant = <A>(a: A) => LazyArg<A>
export const constant: Constant = a => () => a

type ConstFalse = LazyArg<false>
export const constFalse: ConstFalse = () => false

type ConstTrue = LazyArg<true>
export const constTrue: ConstTrue = () => true

type ConstNull = LazyArg<null>
export const constNull: ConstNull = () => null

type ConstUndefined = LazyArg<undefined>
export const constUndefined: ConstUndefined = () => undefined

type ConstVoid = LazyArg<void>
export const constVoid: ConstVoid = () => _
