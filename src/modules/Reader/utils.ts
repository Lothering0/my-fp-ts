import { flow, pipe } from '../../utils/flow'
import { identity } from '../Identity'
import { Reader } from './reader'

export const ask: {
  <Fixed>(): Reader<Fixed, Fixed>
} = () => identity

export const asks: {
  <Fixed, In>(f: (r: Fixed) => In): Reader<Fixed, In>
} = identity

export const asksReader: {
  <Fixed1, Fixed2, In>(
    f: (r: Fixed1) => Reader<Fixed2, In>,
  ): Reader<Fixed1 & Fixed2, In>
} = f => reader => pipe(reader, f(reader))

export const local: {
  <Fixed1, Fixed2>(
    f: (r2: Fixed2) => Fixed1,
  ): <In>(self: Reader<Fixed1, In>) => Reader<Fixed2, In>
} = f => self => flow(f, self)
