import { Eq } from "../../types/Eq"
import { Result } from "./result"
import { match } from "./utils"
import { constFalse } from "../../utils/constant"
import { pipe } from "../../utils/flow"

export const getEq: {
  <E, A>(EE: Eq<E>, EA: Eq<A>): Eq<Result<E, A>>
} = (EE, EA) => ({
  equals: mx => my =>
    pipe (
      mx,
      match (
        x => match (EE.equals (x), constFalse) (my),
        x => match (constFalse, EA.equals (x)) (my),
      ),
    ),
})
