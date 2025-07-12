import { Eq } from "../../types/Eq"
import { Option } from "./option"
import { match } from "./utils"
import { isNone } from "./refinements"
import { overload } from "../../utils/overloads"
import { constFalse } from "../../utils/constant"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<Option<A>>
} = Eq => ({
  equals: overload (1, (mx, my) =>
    match (
      mx,
      () => isNone (my),
      x => match (my, constFalse, Eq.equals (x)),
    ),
  ),
})
