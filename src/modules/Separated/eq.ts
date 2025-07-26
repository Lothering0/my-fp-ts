import { left, right, Separated } from "./separated"
import { Eq } from "../../types/Eq"

export const getEq: {
  <E, A>(EE: Eq<E>, EA: Eq<A>): Eq<Separated<E, A>>
} = (EE, EA) => ({
  equals: mx => my =>
    EE.equals (left (mx)) (left (my)) && EA.equals (right (mx)) (right (my)),
})
