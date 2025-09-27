import * as Comonad_ from '../../typeclasses/Comonad'
import {
  NonEmptyReadonlyArray,
  NonEmptyReadonlyArrayHkt,
} from './non-empty-readonly-array'
import { head } from './utils'
import { Extendable } from './extendable'

export const Comonad: Comonad_.Comonad<NonEmptyReadonlyArrayHkt> = {
  ...Extendable,
  extract: head,
}

export const extract: {
  <A>(self: NonEmptyReadonlyArray<A>): A
} = Comonad.extract
