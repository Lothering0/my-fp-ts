import * as Zippable_ from '../../typeclasses/Zippable'
import { Applicative } from './applicative'
import { State } from './state'

export const Zippable = Zippable_.create(Applicative)

export const zipWith: {
  <A, B, C, S>(
    state: State<S, B>,
    f: (a: A, b: B) => C,
  ): (selfState: State<S, A>) => State<S, C>
} = Zippable.zipWith

export const zip: {
  <A, B, S>(
    state: State<S, B>,
  ): (selfState: State<S, A>) => State<S, readonly [A, B]>
} = Zippable.zip

export const unzip: {
  <A, B, S>(
    zipped: State<S, readonly [A, B]>,
  ): readonly [State<S, A>, State<S, B>]
} = Zippable.unzip
