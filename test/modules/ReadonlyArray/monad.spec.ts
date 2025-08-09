import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import { describeMonadLaws } from "../../_utils/describeMonadLaws"

describeMonadLaws (
  readonlyArray.Monad,
  [[], [1], [1, 2, 3]],
  [() => [], a => [a + 1], a => [a + 1, a + 2, a + 3]],
  [() => [], b => [b / 2, b / 3, b / 4]],
)
