import { Eq } from "../../typeclasses/Eq"
import { Option } from "./option"
import { match } from "./matchers"
import { isNone } from "./refinements"
import { constFalse } from "../../utils/constant"
import { pipe } from "../../utils/flow"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<Option<A>>
} = Eq => ({
  equals: mx => my =>
    pipe (
      mx,
      match ({
        onNone: () => isNone (my),
        onSome: x =>
          pipe (
            my,
            match ({
              onNone: constFalse,
              onSome: Eq.equals (x),
            }),
          ),
      }),
    ),
})
