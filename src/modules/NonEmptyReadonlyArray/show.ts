import * as array from '../ReadonlyArray'
import { NonEmptyReadonlyArray } from './non-empty-readonly-array'
import { Show } from '../../typeclasses/Show'

export const getShow: {
  <A>(Show: Show<A>): Show<NonEmptyReadonlyArray<A>>
} = array.getShow
