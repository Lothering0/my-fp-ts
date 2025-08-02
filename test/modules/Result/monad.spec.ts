import * as result from "../../../src/modules/Result"
import { describeMonadLaws } from "../../_utils/describeMonadLaws"

describeMonadLaws (
  result.Monad,
  [result.fail ("e"), result.succeed (1)],
  [() => result.fail ("e"), a => result.succeed (a + 1)],
  [() => result.fail ("e"), b => result.succeed (b / 2)],
)
