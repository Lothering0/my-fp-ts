import { left, right, Separated } from "./separated"
import { Eq } from "../../typeclasses/Eq"

export const getEq: {
  <E, A>(EqE: Eq<E>, EqA: Eq<A>): Eq<Separated<E, A>>
} = (EqE, EqA) => ({
  equals: mx => my =>
    EqE.equals (left (mx)) (left (my)) && EqA.equals (right (mx)) (right (my)),
})
