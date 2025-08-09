import { Show } from "../../types/Show"
import { Identity, identity } from "./identity"

export const getShow: {
  <A>(Show: Show<A>): Show<Identity<A>>
} = identity
