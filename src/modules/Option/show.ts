import { Show } from "../../types/Show"
import { Option } from "./option"
import { match } from "./utils"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export const getShow: {
  <A>(Show: Show<A>): Show<Option<A>>
} = Show => ({
  show: match (
    constant ("none"),
    flow (Show.show, x => `some (${x})`),
  ),
})
