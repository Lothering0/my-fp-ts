import { URIS, URIS2 } from "../Kind"
import { overload } from "../../utils/overloads"
import { Applicative, Applicative2 } from "../Applicative"
import {
  ApplicativeWithIndex,
  ApplicativeWithIndex2,
} from "./ApplicativeWithIndex"
import { ApplyWithIndex2Pointed, ApplyWithIndexPointed } from "./ApplyWithIndex"

type CreateApplicativeWithIndex = <URI extends URIS, I>(
  applicative: CreateApplicativeWithIndexArg<URI, I>,
) => ApplicativeWithIndex<URI, I>
export const createApplicativeWithIndex: CreateApplicativeWithIndex =
  applicative => ({
    ...applicative,
    applyWithIndex: overload (applicative.applyWithIndex),
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
  readonly applyWithIndex: ApplyWithIndex2Pointed<URI, I>
}
