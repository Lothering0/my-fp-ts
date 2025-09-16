import { number, readonlyArray } from "../../../src"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  readonlyArray.Applicative,
  readonlyArray.getEquivalence (number.Equivalence),
  [[], [1], [1, 2, 3]],
  [[], [number.add (1)], [number.add (3), number.add (4)]],
)
