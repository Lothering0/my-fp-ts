import { HKT, HKT2 } from "./HKT"
import { URIS, URIS2 } from "./Kind"
import { overloadWithPointFree } from "../utils/points"
import { Applicative, Applicative2 } from "./Applicative"

export interface ApplicativeWithIndex<URI extends URIS, I>
  extends Applicative<URI> {
  readonly applyWithIndex: ApplyWithIndex<URI, I>
}

export interface ApplicativeWithIndex2<URI extends URIS2, I>
  extends Applicative2<URI> {
  readonly applyWithIndex: ApplyWithIndex2<URI, I>
}

type CreateApplicativeWithIndex = <URI extends URIS, I>(
  applicative: CreateApplicativeWithIndexArg<URI, I>,
) => ApplicativeWithIndex<URI, I>
export const createApplicativeWithIndex: CreateApplicativeWithIndex =
  applicative => ({
    ...applicative,
    applyWithIndex: overloadWithPointFree (applicative.applyWithIndex),
  })

type CreateApplicativeWithIndex2 = <URI extends URIS2, I>(
  applicative: CreateApplicativeWithIndexArg2<URI, I>,
) => ApplicativeWithIndex2<URI, I>
export const createApplicativeWithIndex2: CreateApplicativeWithIndex2 =
  createApplicativeWithIndex as CreateApplicativeWithIndex2

interface CreateApplicativeWithIndexArg<URI extends URIS, I>
  extends Applicative<URI> {
  readonly applyWithIndex: ApplyWithIndexPointed<URI, I>
}

interface CreateApplicativeWithIndexArg2<URI extends URIS2, I>
  extends Applicative2<URI> {
  readonly applyWithIndex: ApplyWithIndexPointed2<URI, I>
}

interface ApplyWithIndexPointed<URI extends URIS, I> {
  <A, B>(fa: HKT<URI, A>, ff: HKT<URI, (i: I, a: A) => B>): HKT<URI, B>
}

interface ApplyWithIndexPointed2<URI extends URIS2, I> {
  <_, A, B>(
    fa: HKT2<URI, _, A>,
    ff: HKT2<URI, _, (i: I, a: A) => B>,
  ): HKT2<URI, _, B>
}

interface ApplyWithIndex<URI extends URIS, I>
  extends ApplyWithIndexPointed<URI, I> {
  <A, B>(ff: HKT<URI, (i: I, a: A) => B>): (fa: HKT<URI, A>) => HKT<URI, B>
}

interface ApplyWithIndex2<URI extends URIS2, I>
  extends ApplyWithIndexPointed2<URI, I> {
  <_, A, B>(
    ff: HKT2<URI, _, (i: I, a: A) => B>,
  ): (fa: HKT2<URI, _, A>) => HKT2<URI, _, B>
}
