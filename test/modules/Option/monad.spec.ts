import * as option from "../../../src/modules/Option"
import { describeMonadLaws } from "../../_utils/describeMonadLaws"

describeMonadLaws (
  option.Monad,
  [option.none, option.some (1)],
  [option.zero, a => option.some (a + 1)],
  [option.zero, b => option.some (b / 2)],
)
