import * as R from "../../../src/modules/Result"
import * as N from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  R.Applicative,
  [R.failure ("a"), R.success (1)],
  [R.failure ("a"), R.success (N.add (5))],
)
