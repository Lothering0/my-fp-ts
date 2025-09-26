import * as option from '../Option'
import { Semigroup } from '../../typeclasses/Semigroup'
import { pipe } from '../../utils/flow'
import { filterMap } from './filterable'
import { ReadonlyRecord } from './readonly-record'
import { lookup } from './utils'
import { getUnionMagma } from './magma'

export const getIntersectionSemigroup: {
  <A>(Semigroup: Semigroup<A>): Semigroup<ReadonlyRecord<string, A>>
} = Semigroup => ({
  combine: ys => xs =>
    pipe(
      xs,
      filterMap((x, k) =>
        pipe(ys, lookup(k), option.map(Semigroup.combine(x))),
      ),
    ),
})

export const getUnionSemigroup: {
  <A, K extends string>(
    Semigroup: Semigroup<A>,
  ): Semigroup<ReadonlyRecord<K, A>>
} = getUnionMagma
