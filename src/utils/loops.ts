import { _ } from "./underscore"
import { URIS, URIS2 } from "../types/Kind"
import { Functor, Functor2 } from "../types/Functor"
import { Predicate } from "../modules/predicate"
import { HKT, HKT2 } from "../types/HKT"

type GetDoWhile = <URI extends URIS>(
  functor: Functor<URI>,
) => <A>(f: Predicate<void>) => (g: () => A) => HKT<URI, void>
export const getDoWhile: GetDoWhile = functor => p => f => {
  while (p ()) f ()
  return functor.of (_)
}

type GetDoWhile2 = <URI extends URIS2>(
  functor: Functor2<URI>,
) => <E, A>(f: Predicate<void>) => (g: () => A) => HKT2<URI, E, void>
export const getDoWhile2: GetDoWhile2 = getDoWhile as GetDoWhile2
