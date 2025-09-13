import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import * as string from "../../../src/modules/String"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  result.Applicative,
  result.getEq (string.Eq, number.Eq),
  [result.fail ("a"), result.succeed (1)],
  [result.fail ("a"), result.succeed (number.add (5))],
)
