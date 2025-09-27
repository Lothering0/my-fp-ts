import * as Boolean from '../Boolean'
import { Magma } from '../../typeclasses/Magma'
import { concat, has, getUnion } from './utils'
import { ReadonlyRecord } from './readonly-record'
import { filter } from './filterable'
import { pipe } from '../../utils/flow'

export const getDifferenceMagma: {
  <A, K extends string>(): Magma<ReadonlyRecord<K, A>>
} = () => ({
  combine: y => x =>
    pipe(
      x,
      concat(y),
      filter((_, k) => pipe(has(k)(x), Boolean.and(has(k)(y)), Boolean.not)),
    ),
})

export const getUnionMagma: {
  <A, K extends string>(Magma: Magma<A>): Magma<ReadonlyRecord<K, A>>
} = Magma => ({
  combine: getUnion(Magma),
})
