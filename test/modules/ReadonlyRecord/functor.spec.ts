import * as readonlyRecord from "../../../src/modules/ReadonlyRecord"
import * as number from "../../../src/modules/Number"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (readonlyRecord.Functor, readonlyRecord.getEq (number.Eq), [
  {},
  { a: 1 },
  { a: 1, b: 2, c: 3 },
])
