import * as Monad_ from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { FromIdentity } from './from-identity'
import { Functor } from './functor'
import { Reader, ReaderHkt } from './reader'

export const Monad = Monad_.create<ReaderHkt>(FromIdentity, Functor, {
  flat: reader => r => reader(r)(r),
})

export const Do = Monad.Do

export const flat: {
  <R, A>(reader: Reader<R, Reader<R, A>>): Reader<R, A>
} = Monad.flat

export const flatMap: {
  <R, A, B>(amb: (a: A) => Reader<R, B>): (reader: Reader<R, A>) => Reader<R, B>
} = Monad.flatMap

export const andThen: {
  <R, A>(reader: Reader<R, A>): (selfReader: Reader<R, unknown>) => Reader<R, A>
} = Monad.andThen

export const compose: {
  <R, A, Out1, Out2>(
    amb: (a: A) => Reader<R, Out1>,
    bmc: (b: Out1) => Reader<R, Out2>,
  ): (a: A) => Reader<R, Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <R>(reader: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <R>(reader: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.mapTo

export const flipApplyTo: {
  <N extends DoObjectKey, R, A, B>(
    name: Exclude<N, keyof A>,
    reader: Reader<R, (a: A) => B>,
  ): (selfReader: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.flipApplyTo

export const bind: {
  <N extends DoObjectKey, R, A, B>(
    name: Exclude<N, keyof A>,
    reader: Reader<R, B>,
  ): (selfReader: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.bind

export const flatMapTo: {
  <N extends DoObjectKey, R, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Reader<R, B>,
  ): (selfReader: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.flatMapTo
