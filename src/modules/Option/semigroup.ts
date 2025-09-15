import { Option, none, some } from "./option"
import { Semigroup } from "../../typeclasses/Semigroup"
import { isNone } from "./refinements"
import { value } from "./utils"
import { pipe } from "../../utils/flow"

export const getSemigroup: {
  <A>(Semigroup: Semigroup<A>): Semigroup<Option<A>>
} = Semigroup => ({
  combine: mx => my =>
    isNone (mx)
      ? isNone (my)
        ? none
        : my
      : isNone (my)
        ? mx
        : pipe (my, value, Semigroup.combine (value (mx)), some),
})
