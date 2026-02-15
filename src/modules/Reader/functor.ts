import * as Functor_ from '../../typeclasses/Functor'
import { flow } from '../../utils/flow'
import { Reader, ReaderHkt } from './reader'

export const Functor = Functor_.create<ReaderHkt>({
  map: ab => reader => flow(reader, ab),
})

export const map: {
  <R, A, B>(ab: (a: A) => B): (reader: Reader<R, A>) => Reader<R, B>
} = Functor.map

export const as: {
  <R, A>(a: A): (reader: Reader<R, unknown>) => Reader<R, A>
} = Functor.as
