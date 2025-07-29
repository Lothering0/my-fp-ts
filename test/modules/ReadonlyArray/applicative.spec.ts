import * as readonlyArray from "../../../src/modules/ReadonlyArray"
import * as number from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  readonlyArray.Applicative,
  [[], [1], [1, 2, 3]],
  [[], [number.add (1)], [number.add (3), number.add (4)]],
)
