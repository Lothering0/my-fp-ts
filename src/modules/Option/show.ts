import { Show } from "../../types/Show"
import { Option } from "./option"
import { match } from "./utils"
import { constant } from "../../utils/constant"
import { flow } from "../../utils/flow"

export const getShow: {
  <A>(S: Show<A>): Show<Option<A>>
} = S => ({
  show: match (
    constant ("none"),
    flow (S.show, x => `some (${x})`),
  ),
})
