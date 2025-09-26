import { Equivalence } from '../../typeclasses/Equivalence'
import { Option } from './option'
import { match } from './matchers'
import { isNone } from './refinements'
import { constFalse } from '../../utils/constant'
import { pipe } from '../../utils/flow'

export const getEquivalence: {
  <A>(Equivalence: Equivalence<A>): Equivalence<Option<A>>
} = Equivalence => ({
  equals: mx => my =>
    pipe(
      mx,
      match({
        onNone: () => isNone(my),
        onSome: x =>
          pipe(
            my,
            match({
              onNone: constFalse,
              onSome: Equivalence.equals(x),
            }),
          ),
      }),
    ),
})
