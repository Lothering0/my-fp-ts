import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"

interface ApplyPointed<URI extends URIS> {
  <A, B>(fa: HKT<URI, A>, ff: HKT<URI, (a: A) => B>): HKT<URI, B>
}

interface Apply<URI extends URIS> extends ApplyPointed<URI> {
  <A, B>(ff: HKT<URI, (a: A) => B>): (fa: HKT<URI, A>) => HKT<URI, B>
}

export interface Applicative<URI extends URIS> {
  readonly _URI: URI
  readonly apply: Apply<URI>
}

type CreateApplicative = <URI extends URIS>(
  functor: Omit<Applicative<URI>, "apply"> & {
    apply: ApplyPointed<URI>
  },
) => Applicative<URI>
export const createApplicative: CreateApplicative = applicative => ({
  ...applicative,
  apply: overloadWithPointFree (applicative.apply),
})

interface ApplyPointed2<URI extends URIS2> {
  <E, A, B>(fa: HKT2<URI, E, A>, ff: HKT2<URI, E, (a: A) => B>): HKT2<URI, E, B>
}

interface Apply2<URI extends URIS2> extends ApplyPointed2<URI> {
  <E, A, B>(
    ff: HKT2<URI, E, (a: A) => B>,
  ): (fa: HKT2<URI, E, A>) => HKT2<URI, E, B>
}

export interface Applicative2<URI extends URIS2> {
  readonly _URI: URI
  readonly apply: Apply2<URI>
}

type CreateApplicative2 = <URI extends URIS2>(
  functor: Omit<Applicative2<URI>, "apply"> & {
    apply: ApplyPointed2<URI>
  },
) => Applicative2<URI>
export const createApplicative2: CreateApplicative2 =
  createApplicative as CreateApplicative2
