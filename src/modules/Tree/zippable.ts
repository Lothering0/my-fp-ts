import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Tree } from './tree'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(tree: Tree<B>, f: (a: A, b: B) => C): (selfTree: Tree<A>) => Tree<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(tree: Tree<B>): (selfTree: Tree<A>) => Tree<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Tree<readonly [A, B]>): readonly [Tree<A>, Tree<B>]
} = Zippable.unzip
