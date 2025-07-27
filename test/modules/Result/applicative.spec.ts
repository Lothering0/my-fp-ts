import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  result.Applicative,
  [result.failure ("a"), result.success (1)],
  [result.failure ("a"), result.success (number.add (5))],
)
