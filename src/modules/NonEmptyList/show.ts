import * as List from '../List'
import { NonEmptyList } from './non-empty-list'
import { Show } from '../../typeclasses/Show'

export const getShow: {
  <A>(Show: Show<A>): Show<NonEmptyList<A>>
} = List.getShow
