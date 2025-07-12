import { Eq } from "../../types/Eq"
import { identity } from "./identity"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<A>
} = identity
