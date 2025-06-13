import { URIS, URIS2 } from "../Kind"
import { Applicative, Applicative2 } from "../Applicative"
import {
  ApplicativeWithIndex,
  ApplicativeWithIndex2,
} from "./ApplicativeWithIndex"
import { ApplyWithIndex2Pointed, ApplyWithIndexPointed } from "./ApplyWithIndex"
import { FunctorWithIndex, FunctorWithIndex2 } from "../FunctorWithIndex"
import { overload } from "../../utils/overloads"
import { pipe } from "../../utils/flow"
import { curry } from "../../utils/curry"
import { uncurry } from "../../utils/uncurry"
import { flip } from "../../utils/flip"

type CreateApplicativeWithIndex = <URI extends URIS, I>(
  applicative: CreateApplicativeWithIndexArg<URI, I>,
) => ApplicativeWithIndex<URI, I>
export const createApplicativeWithIndex: CreateApplicativeWithIndex =
  applicative => ({
    ...applicative,
    applyWithIndex: overload (applicative.applyWithIndex),
    apWithIndex: pipe (
      applicative.applyWithIndex,
      curry,
      flip,
      uncurry,
      overload,
    ),
  })

type CreateApplicativeWithIndex2 = <URI extends URIS2, I>(
  applicative: CreateApplicativeWithIndexArg2<URI, I>,
) => ApplicativeWithIndex2<URI, I>
export const createApplicativeWithIndex2: CreateApplicativeWithIndex2 =
  createApplicativeWithIndex as CreateApplicativeWithIndex2

interface CreateApplicativeWithIndexArg<URI extends URIS, I>
  extends Applicative<URI>,
    FunctorWithIndex<URI, I> {
  readonly applyWithIndex: ApplyWithIndexPointed<URI, I>
}

interface CreateApplicativeWithIndexArg2<URI extends URIS2, I>
  extends Applicative2<URI>,
    FunctorWithIndex2<URI, I> {
  readonly applyWithIndex: ApplyWithIndex2Pointed<URI, I>
}
