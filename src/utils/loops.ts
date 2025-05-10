import { _ } from "./underscore"
import { URIS, URIS2 } from "../types/Kind"
import { Applicative, Applicative2 } from "../types/Applicative"
import { Predicate } from "../modules/predicate"
import { HKT, HKT2 } from "../types/HKT"

type GetDoWhile = <URI extends URIS>(
  applicative: Applicative<URI>,
) => <A>(f: Predicate<void>) => (g: () => A) => HKT<URI, void>
export const getDoWhile: GetDoWhile = applicative => p => f => {
  while (p ()) f ()
  return applicative.of (_)
}

type GetDoWhile2 = <URI extends URIS2>(
  applicative: Applicative2<URI>,
) => <E, A>(f: Predicate<void>) => (g: () => A) => HKT2<URI, E, void>
export const getDoWhile2: GetDoWhile2 = getDoWhile as GetDoWhile2
