import * as List from './list'
import * as Alternative_ from '../../typeclasses/Alternative'
import { Alt } from './alt'

export const zero: {
  <A>(): List.List<A>
} = List.nil

export const Alternative: Alternative_.Alternative<List.ListHkt> = {
  ...Alt,
  zero,
}
