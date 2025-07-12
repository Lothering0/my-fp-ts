import { left, right, Separated } from "./separated"
import { Eq } from "../../types/Eq"
import { overload } from "../../utils/overloads"

export const getEq: {
  <E, A>(EE: Eq<E>, EA: Eq<A>): Eq<Separated<E, A>>
} = (EE, EA) => ({
  equals: overload (
    1,
    (mx, my) =>
      EE.equals (left (mx), left (my)) && EA.equals (right (mx), right (my)),
  ),
})
