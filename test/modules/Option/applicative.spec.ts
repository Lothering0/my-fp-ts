import * as option from "../../../src/modules/Option"
import * as number from "../../../src/modules/Number"
import { describeApplicativeLaws } from "../../_utils/describeApplicativeLaws"

describeApplicativeLaws (
  option.Applicative,
  [option.some (1), option.none],
  [option.some (number.add (5)), option.none],
)
