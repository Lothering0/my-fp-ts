import * as Zippable_ from '../../typeclasses/Zippable'
import * as List from './list'
import { isCons } from './refinements'
import { reverse } from './utils'

export const zipWith =
  <F extends List.List<any>, G extends List.List<any>, C>(
    list: G,
    abic: (a: List.Infer<F>, b: List.Infer<G>, i: number) => C,
  ) =>
  (selfList: F): List.AndNonEmpty<F, G, C> => {
    let out = List.nil<C>()
    let i = -1

    while (isCons(list) && isCons(selfList)) {
      i++
      out = List.cons(abic(selfList.head, list.head, i), out)
      list = list.tail as G
      selfList = selfList.tail as F
    }

    return reverse(out) as List.NonEmpty<C>
  }

export const zip: {
  <F extends List.List<any>>(
    list: F,
  ): <G extends List.List<any>>(
    selfList: G,
  ) => List.AndNonEmpty<F, G, readonly [List.Infer<G>, List.Infer<F>]>
} = bs => zipWith(bs, (a, b) => [a, b]) as any

export const unzip = <F extends List.List<readonly [any, any]>>(
  zipped: F,
): readonly [
  List.With<F, List.Infer<F>[0]>,
  List.With<F, List.Infer<F>[1]>,
] => {
  let as = List.nil<List.Infer<F>>()
  let bs = List.nil<List.Infer<F>>()

  for (const [a, b] of zipped) {
    as = List.cons(a, as)
    bs = List.cons(b, bs)
  }

  return [reverse(as), reverse(bs)] as any
}

export const Zippable: Zippable_.Zippable<List.Hkt> = {
  zipWith,
  zip,
  unzip,
}

export const NonEmptyZippable: Zippable_.Zippable<List.NonEmptyHkt> = {
  zipWith,
  zip,
  unzip,
}
