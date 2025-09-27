import * as Monad_ from '../../typeclasses/Monad'
import { DoObject, DoObjectKey } from '../../types/DoObject'
import { Applicative } from './applicative'
import { Reader, ReaderHkt } from './reader'

export const Monad = Monad_.create<ReaderHkt>(Applicative, {
  flat: self => reader => self(reader)(reader),
})

export const Do = Monad.Do

export const flat: {
  <Fixed, In>(self: Reader<Fixed, Reader<Fixed, In>>): Reader<Fixed, In>
} = Monad.flat

export const flatMap: {
  <Fixed, In, Out>(
    amb: (a: In) => Reader<Fixed, Out>,
  ): (self: Reader<Fixed, In>) => Reader<Fixed, Out>
} = Monad.flatMap

export const compose: {
  <Fixed, In, Out1, Out2>(
    bmc: (b: Out1) => Reader<Fixed, Out2>,
    amb: (a: In) => Reader<Fixed, Out1>,
  ): (a: In) => Reader<Fixed, Out2>
} = Monad.compose

export const setTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    b: Out,
  ): <R>(self: Reader<R, In>) => Reader<R, DoObject<N, In, Out>>
} = Monad.setTo

export const mapTo: {
  <N extends DoObjectKey, In, Out>(
    name: Exclude<N, keyof In>,
    ab: (a: In) => Out,
  ): <R>(self: Reader<R, In>) => Reader<R, DoObject<N, In, Out>>
} = Monad.mapTo

export const flapTo: {
  <N extends DoObjectKey, Fixed, In, Out>(
    name: Exclude<N, keyof In>,
    fab: Reader<Fixed, (a: In) => Out>,
  ): (self: Reader<Fixed, In>) => Reader<Fixed, DoObject<N, In, Out>>
} = Monad.flapTo

export const apS: {
  <N extends DoObjectKey, Fixed, In, Out>(
    name: Exclude<N, keyof In>,
    fb: Reader<Fixed, Out>,
  ): (self: Reader<Fixed, In>) => Reader<Fixed, DoObject<N, In, Out>>
} = Monad.apS

export const flatMapTo: {
  <N extends DoObjectKey, Fixed, In, Out>(
    name: Exclude<N, keyof In>,
    amb: (a: In) => Reader<Fixed, Out>,
  ): (self: Reader<Fixed, In>) => Reader<Fixed, DoObject<N, In, Out>>
} = Monad.flatMapTo
