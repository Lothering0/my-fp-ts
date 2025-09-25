import { number, array } from "../../../src"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  array.Applicative,
  array.getEquivalence (number.Equivalence),
  [[], [1], [1, 2, 3]],
  [[], [number.add (1)], [number.add (3), number.add (4)]],
)
