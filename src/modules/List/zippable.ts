import * as Zippable_ from '../../typeclasses/Zippable'
import * as List from './list'
import { isCons } from './refinements'
import { reverse } from './utils'

export const zipWith =
  <A, B, C>(list: List.List<B>, abic: (a: A, b: B, i: number) => C) =>
  (selfList: List.List<A>): List.List<C> => {
    let out = List.nil<C>()
    let i = -1

    while (isCons(list) && isCons(selfList)) {
      i++
      out = List.cons(abic(selfList.head, list.head, i), out)
      list = list.tail
      selfList = selfList.tail
    }

    return reverse(out)
  }

export const zip: {
  <B>(
    list: List.List<B>,
  ): <A>(selfList: List.List<A>) => List.List<readonly [A, B]>
} = bs => zipWith(bs, (a, b) => [a, b])

export const unzip = <A, B>(
  zipped: List.List<readonly [A, B]>,
): readonly [List.List<A>, List.List<B>] => {
  let as = List.nil<A>()
  let bs = List.nil<B>()

  for (const [a, b] of zipped) {
    as = List.cons(a, as)
    bs = List.cons(b, bs)
  }

  return [reverse(as), reverse(bs)]
}

export const Zippable: Zippable_.Zippable<List.ListHkt> = {
  zipWith,
  zip,
  unzip,
}
