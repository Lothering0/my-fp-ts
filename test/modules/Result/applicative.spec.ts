import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  result.Applicative,
  [result.fail ("a"), result.succeed (1)],
  [result.fail ("a"), result.succeed (number.add (5))],
)
