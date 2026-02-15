import * as Comonad_ from '../../typeclasses/Comonad'
import { Tree, Hkt } from './tree'
import { valueOf } from './utils'
import { Extendable } from './extendable'

export const Comonad: Comonad_.Comonad<Hkt> = {
  ...Extendable,
  extract: valueOf,
}

export const extract: {
  <A>(tree: Tree<A>): A
} = Comonad.extract
