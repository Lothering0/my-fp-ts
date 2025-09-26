import * as comonad from '../../typeclasses/Comonad'
import { Tree, TreeHkt } from './tree'
import { valueOf } from './utils'
import { Extendable } from './extendable'

export const Comonad: comonad.Comonad<TreeHkt> = {
  ...Extendable,
  extract: valueOf,
}

export const extract: {
  <A>(self: Tree<A>): A
} = Comonad.extract
