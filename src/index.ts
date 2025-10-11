import * as Option from './modules/Option'
import * as Array from './modules/ReadonlyArray'
import * as NonEmptyArray from './modules/NonEmptyReadonlyArray'
import * as Iterable from './modules/Iterable'
import * as Result from './modules/Result'
import * as State from './modules/State'
import * as Reader from './modules/Reader'
import * as Tree from './modules/Tree'

// modules
export * as Async from './modules/Async'
export * as AsyncOption from './modules/AsyncOption'
export * as AsyncResult from './modules/AsyncResult'
export * as Boolean from './modules/Boolean'
export * as Duration from './modules/Duration'
export * as Effect from './modules/Effect'
export * as Identity from './modules/Identity'
export { identity } from './modules/Identity'
export * as Iterable from './modules/Iterable'
export * as NonEmptyArray from './modules/NonEmptyReadonlyArray'
export * as Number from './modules/Number'
export * as Option from './modules/Option'
export * as Predicate from './modules/Predicate'
export * as Reader from './modules/Reader'
export * as Array from './modules/ReadonlyArray'
export * as Record from './modules/ReadonlyRecord'
export * as Result from './modules/Result'
export * as Schema from './modules/Schema'
export * as State from './modules/State'
export * as String from './modules/String'
export * as Sync from './modules/Sync'
export * as SyncOption from './modules/SyncOption'
export * as SyncResult from './modules/SyncResult'
export * as Tree from './modules/Tree'
export * as Json from './modules/Json'
export * as List from './modules/List'
export * as Matching from './modules/Matching'
export * as Ordering from './modules/Ordering'
export { Refinement, RefinementWithIndex } from './modules/Refinement'
export * as Exception from './modules/Exception'
export { UnknownException } from './modules/Exception'

// transformers
export const OptionOption = Option.transform(Option.Monad)
export const ArrayOfOptions = Option.transform(Array.Monad)
export const NonEmptyArrayOfOptions = Option.transform(NonEmptyArray.Monad)
export const IterableOfOptions = Option.transform(Iterable.Monad)
export const ResultOption = Option.transform(Result.Monad)
export const StateOption = Option.transform(State.Monad)
export const ReaderOption = Option.transform(Reader.Monad)
export const TreeOfOptions = Option.transform(Tree.Monad)

export const OptionResult = Result.transform(Option.Monad)
export const ArrayOfResults = Result.transform(Array.Monad)
export const NonEmptyArrayOfResults = Result.transform(NonEmptyArray.Monad)
export const IterableOfResults = Result.transform(Iterable.Monad)
export const ResultResult = Result.transform(Result.Monad)
export const StateResult = Result.transform(State.Monad)
export const ReaderResult = Result.transform(Reader.Monad)
export const TreeOfResults = Result.transform(Tree.Monad)

export const OptionState = State.transform(Option.Monad)
export const ArrayOfStates = State.transform(Array.Monad)
export const NonEmptyArrayOfStates = State.transform(NonEmptyArray.Monad)
export const IterableOfStates = State.transform(Iterable.Monad)
export const ResultState = State.transform(Result.Monad)
export const StateState = State.transform(State.Monad)
export const ReaderState = State.transform(Reader.Monad)
export const TreeOfStates = State.transform(Tree.Monad)

// typeclasses
export * as Alt from './typeclasses/Alt'
export * as Alternative from './typeclasses/Alternative'
export * as Applicative from './typeclasses/Applicative'
export * as ApplicativeWithIndex from './typeclasses/ApplicativeWithIndex'
export * as Bifunctor from './typeclasses/Bifunctor'
export * as Comonad from './typeclasses/Comonad'
export * as Compactable from './typeclasses/Compactable'
export * as Contravariant from './typeclasses/Contravariant'
export * as Endomorphism from './typeclasses/Endomorphism'
export * as Equivalence from './typeclasses/Equivalence'
export * as Extendable from './typeclasses/Extendable'
export * as Filterable from './typeclasses/Filterable'
export * as FilterableWithIndex from './typeclasses/FilterableWithIndex'
export * as FromIdentity from './typeclasses/FromIdentity'
export * as Functor from './typeclasses/Functor'
export * as FunctorWithIndex from './typeclasses/FunctorWithIndex'
export * as Group from './typeclasses/Group'
export { Hkt, Kind } from './typeclasses/Hkt'
export * as Magma from './typeclasses/Magma'
export * as Monad from './typeclasses/Monad'
export * as MonadWithIndex from './typeclasses/MonadWithIndex'
export * as Monoid from './typeclasses/Monoid'
export { NaturalTransformation } from './typeclasses/NaturalTransformation'
export * as Order from './typeclasses/Order'
export * as Profunctor from './typeclasses/Profunctor'
export * as Semigroup from './typeclasses/Semigroup'
export * as Show from './typeclasses/Show'
export * as Tappable from './typeclasses/Tappable'
export * as TappableBoth from './typeclasses/TappableBoth'
export { TypeClass } from './typeclasses/TypeClass'

// types
export { DoObject, DoObjectKey } from './types/DoObject'
export { Tag, Tagged } from './types/Tag'
export {
  LazyArg,
  Prettify,
  TheseOrAnyNumber,
  TheseOrAnyString,
} from './types/utils'

// utils
export * from './utils/absurd'
export * from './utils/ask'
export * from './utils/call'
export * as Console from './utils/console'
export * from './utils/constant'
export * from './utils/currying'
export * from './utils/exceptions'
export * from './utils/flow'
export * from './utils/flip'
export * from './utils/hole'
export * from './utils/loops'
export * from './utils/random'
export * from './utils/time'
export * from './utils/typeChecks'
export * from './utils/underscore'
export * from './utils/wait'
