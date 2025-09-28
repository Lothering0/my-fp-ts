import * as Monad_ from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Applicative } from './applicative'
import { Reader, ReaderHkt } from './reader'

export const Monad = Monad_.create<ReaderHkt>(Applicative, {
  flat: self => reader => self(reader)(reader),
})

export const Do = Monad.Do

export const flat: {
  <R, A>(self: Reader<R, Reader<R, A>>): Reader<R, A>
} = Monad.flat

export const flatMap: {
  <R, A, B>(amb: (a: A) => Reader<R, B>): (self: Reader<R, A>) => Reader<R, B>
} = Monad.flatMap

export const compose: {
  <R, A, Out1, Out2>(
    bmc: (b: Out1) => Reader<R, Out2>,
    amb: (a: A) => Reader<R, Out1>,
  ): (a: A) => Reader<R, Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    b: B,
  ): <R>(self: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, A, B>(
    name: Exclude<N, keyof A>,
    ab: (a: A) => B,
  ): <R>(self: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, R, A, B>(
    name: Exclude<N, keyof A>,
    fab: Reader<R, (a: A) => B>,
  ): (self: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, R, A, B>(
    name: Exclude<N, keyof A>,
    fb: Reader<R, B>,
  ): (self: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, R, A, B>(
    name: Exclude<N, keyof A>,
    amb: (a: A) => Reader<R, B>,
  ): (self: Reader<R, A>) => Reader<R, DoObject<N, A, B>>
} = Monad.flatMapTo
