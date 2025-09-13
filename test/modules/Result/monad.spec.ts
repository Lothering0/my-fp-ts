import * as result from "../../../src/modules/Result"
import * as number from "../../../src/modules/Number"
import * as string from "../../../src/modules/String"
import { describeMonadLaws } from "../../_utils/describeMonadLaws"

describeMonadLaws (
  result.Monad,
  result.getEq (string.Eq, number.Eq),
  [result.fail ("e"), result.succeed (1)],
  [() => result.fail ("e"), a => result.succeed (a + 1)],
  [() => result.fail ("e"), b => result.succeed (b / 2)],
)
