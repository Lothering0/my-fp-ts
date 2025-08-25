import * as readonlyRecord from "../../../src/modules/ReadonlyRecord"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (readonlyRecord.Functor, [
  {},
  { a: 1 },
  { a: 1, b: 2, c: 3 },
])
