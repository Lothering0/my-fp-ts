import { Eq } from "../../typeclasses/Eq"
import { Result } from "./result"
import { match } from "./utils"
import { constFalse } from "../../utils/constant"
import { pipe } from "../../utils/flow"

export const getEq: {
  <E, A>(EqE: Eq<E>, EqA: Eq<A>): Eq<Result<E, A>>
} = (EqE, EqA) => ({
  equals: mx => my =>
    pipe (
      mx,
      match (
        x => match (EqE.equals (x), constFalse) (my),
        x => match (constFalse, EqA.equals (x)) (my),
      ),
    ),
})
