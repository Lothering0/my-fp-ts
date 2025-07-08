import { Show } from "../../types/Show"
import { identity } from "./identity"

export const getShow: {
  <A>(S: Show<A>): Show<A>
} = identity
