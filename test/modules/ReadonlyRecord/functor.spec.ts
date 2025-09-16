import { number, readonlyRecord } from "../../../src"
import { describeFunctorLaws } from "../../_utils/describeFunctorLaws"

describeFunctorLaws (
  readonlyRecord.Functor,
  readonlyRecord.getEquivalence (number.Equivalence),
  [{}, { a: 1 }, { a: 1, b: 2, c: 3 }],
)
