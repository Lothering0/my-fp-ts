import * as Option from './option'
import { create } from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { Functor } from './functor'
import { identity } from '../Identity'
import { match } from './matchers'

export const Monad = create<Option.OptionHkt>(FromIdentity, Functor, {
  flat: match({
    onNone: Option.none,
    onSome: identity,
  }),
})

export const Do = Monad.Do

export const flat: {
  <A>(self: Option.Option<Option.Option<A>>): Option.Option<A>
} = Monad.flat

export const flatMap: {
  <A, B>(
    amb: (a: A) => Option.Option<B>,
  ): (self: Option.Option<A>) => Option.Option<B>
} = Monad.flatMap

export const compose: {
  <A, B, C>(
    bmc: (b: B) => Option.Option<C>,
    amb: (a: A) => Option.Option<B>,
  ): (a: A) => Option.Option<C>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): (self: Option.Option<A>) => Option.Option<DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): (self: Option.Option<A>) => Option.Option<DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fab: Option.Option<(a: A) => B>,
  ): (self: Option.Option<A>) => Option.Option<DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    fb: Option.Option<B>,
  ): (self: Option.Option<A>) => Option.Option<DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Option.Option<B>,
  ): (self: Option.Option<A>) => Option.Option<DoObject<N, A, B>>
} = Monad.flatMapTo
