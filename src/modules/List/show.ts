import { List } from './list'
import { Show } from '../../typeclasses/Show'
import { reduceRight } from './foldable'

export const getShow: {
  <A>(Show: Show<A>): Show<List<A>>
} = Show => ({
  show: reduceRight(
    'List.nil()',
    (a, acc) => `List.cons(${Show.show(a)}, ${acc})`,
  ),
})
