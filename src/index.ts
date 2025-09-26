import * as option from "./modules/Option"
import * as array from "./modules/ReadonlyArray"
import * as nonEmptyArray from "./modules/NonEmptyReadonlyArray"
import * as iterable from "./modules/Iterable"
import * as result from "./modules/Result"
import * as state from "./modules/State"
import * as reader from "./modules/Reader"
import * as tree from "./modules/Tree"

// modules
export * as async from "./modules/Async"
export * as asyncOption from "./modules/AsyncOption"
export * as asyncResult from "./modules/AsyncResult"
export * as boolean from "./modules/Boolean"
export * as duration from "./modules/Duration"
export { identity } from "./modules/Identity"
export * as iterable from "./modules/Iterable"
export * as nonEmptyArray from "./modules/NonEmptyReadonlyArray"
export * as number from "./modules/Number"
export * as option from "./modules/Option"
export * as predicate from "./modules/Predicate"
export * as reader from "./modules/Reader"
export * as array from "./modules/ReadonlyArray"
export * as record from "./modules/ReadonlyRecord"
export * as result from "./modules/Result"
export * as schema from "./modules/Schema"
export * as state from "./modules/State"
export * as string from "./modules/String"
export * as sync from "./modules/Sync"
export * as syncOption from "./modules/SyncOption"
export * as syncResult from "./modules/SyncResult"
export * as tree from "./modules/Tree"
export * as json from "./modules/Json"
export * as list from "./modules/List"
export * as matching from "./modules/Matching"
export * as ordering from "./modules/Ordering"
export * as refinement from "./modules/Refinement"

// transformers
export const optionOption = option.transform (option.Monad)
export const arrayOfOptions = option.transform (array.Monad)
export const nonEmptyArrayOfOptions = option.transform (nonEmptyArray.Monad)
export const iterableOfOptions = option.transform (iterable.Monad)
export const resultOption = option.transform (result.Monad)
export const stateOption = option.transform (state.Monad)
export const readerOption = option.transform (reader.Monad)
export const treeOfOptions = option.transform (tree.Monad)

export const optionResult = result.transform (option.Monad)
export const arrayOfResults = result.transform (array.Monad)
export const nonEmptyArrayOfResults = result.transform (nonEmptyArray.Monad)
export const iterableOfResults = result.transform (iterable.Monad)
export const resultResult = result.transform (result.Monad)
export const stateResult = result.transform (state.Monad)
export const readerResult = result.transform (reader.Monad)
export const treeOfResults = result.transform (tree.Monad)

export const optionState = state.transform (option.Monad)
export const arrayOfStates = state.transform (array.Monad)
export const nonEmptyArrayOfStates = state.transform (nonEmptyArray.Monad)
export const iterableOfStates = state.transform (iterable.Monad)
export const resultState = state.transform (result.Monad)
export const stateState = state.transform (state.Monad)
export const readerState = state.transform (reader.Monad)
export const treeOfStates = state.transform (tree.Monad)

// typeclasses
export * as alt from "./typeclasses/Alt"
export * as alternative from "./typeclasses/Alternative"
export * as applicative from "./typeclasses/Applicative"
export * as applicativeWithIndex from "./typeclasses/ApplicativeWithIndex"
export * as bifunctor from "./typeclasses/Bifunctor"
export * as comonad from "./typeclasses/Comonad"
export * as compactable from "./typeclasses/Compactable"
export * as contravariant from "./typeclasses/Contravariant"
export * as endomorphism from "./typeclasses/Endomorphism"
export * as equivalence from "./typeclasses/Equivalence"
export * as extendable from "./typeclasses/Extendable"
export * as filterable from "./typeclasses/Filterable"
export * as filterableWithIndex from "./typeclasses/FilterableWithIndex"
export * as functor from "./typeclasses/Functor"
export * as functorWithIndex from "./typeclasses/FunctorWithIndex"
export * as group from "./typeclasses/Group"
export { Hkt, Kind } from "./typeclasses/Hkt"
export * as magma from "./typeclasses/Magma"
export * as monad from "./typeclasses/Monad"
export * as monadWithIndex from "./typeclasses/MonadWithIndex"
export * as monoid from "./typeclasses/Monoid"
export { NaturalTransformation } from "./typeclasses/NaturalTransformation"
export * as order from "./typeclasses/Order"
export * as profunctor from "./typeclasses/Profunctor"
export * as semigroup from "./typeclasses/Semigroup"
export * as show from "./typeclasses/Show"
export * as tappable from "./typeclasses/Tappable"
export * as tappableBoth from "./typeclasses/TappableBoth"
export { TypeClass } from "./typeclasses/TypeClass"

// types
export { DoObject, DoObjectKey } from "./types/DoObject"
export {
  LazyArg,
  Prettify,
  TheseOrAnyNumber,
  TheseOrAnyString,
} from "./types/utils"

// utils
export * from "./utils/absurd"
export * from "./utils/ask"
export * from "./utils/call"
export * as Console from "./utils/console"
export * from "./utils/constant"
export * from "./utils/currying"
export * from "./utils/exceptions"
export * as files from "./utils/files"
export * from "./utils/flow"
export * from "./utils/flip"
export * from "./utils/hole"
export * from "./utils/loops"
export * from "./utils/random"
export * from "./utils/time"
export * from "./utils/typeChecks"
export * from "./utils/underscore"
export * from "./utils/wait"
