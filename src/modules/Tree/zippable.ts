import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { Tree } from './tree'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C>(that: Tree<B>, f: (a: A, b: B) => C): (self: Tree<A>) => Tree<C>
} = Zippable.zipWith

export const zip: {
  <A, B>(that: Tree<B>): (self: Tree<A>) => Tree<readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B>(zipped: Tree<readonly [A, B]>): readonly [Tree<A>, Tree<B>]
} = Zippable.unzip
