import { _ } from "./underscore"
import { URIS, URIS2 } from "../types/Kind"
import { Applicative, Applicative2 } from "../types/Applicative"
import { Predicate } from "../modules/Predicate"
import { Kind, Kind2 } from "../types/Kind"
import { LazyArg } from "../types/utils"

type GetDoWhile = <URI extends URIS>(
  applicative: Applicative<URI>,
) => <A>(f: Predicate<void>) => (g: LazyArg<A>) => Kind<URI, void>
export const getDoWhile: GetDoWhile = applicative => p => f => {
  while (p ()) f ()
  return applicative.of (_)
}

type GetDoWhile2 = <URI extends URIS2>(
  applicative: Applicative2<URI>,
) => <E, A>(f: Predicate<void>) => (g: LazyArg<A>) => Kind2<URI, E, void>
export const getDoWhile2: GetDoWhile2 = getDoWhile as GetDoWhile2
