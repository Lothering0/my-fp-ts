import { Eq } from "../../types/Eq"
import { Result } from "./result"
import { match } from "./utils"
import { overload } from "../../utils/overloads"
import { constFalse } from "../../utils/constant"

export const getEq: {
  <E, A>(EE: Eq<E>, EA: Eq<A>): Eq<Result<E, A>>
} = (EE, EA) => ({
  equals: overload (1, (mx, my) =>
    match (
      mx,
      x => match (my, EE.equals (x), constFalse),
      x => match (my, constFalse, EA.equals (x)),
    ),
  ),
})
