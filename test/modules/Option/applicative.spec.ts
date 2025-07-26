import * as O from "../../../src/modules/Option"
import * as N from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  O.Applicative,
  [O.some (1), O.none],
  [O.some (N.add (5)), O.none],
)
