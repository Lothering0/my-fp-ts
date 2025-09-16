import { number, result, string } from "../../../src"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  result.Applicative,
  result.getEquivalence (string.Equivalence, number.Equivalence),
  [result.fail ("a"), result.succeed (1)],
  [result.fail ("a"), result.succeed (number.add (5))],
)
