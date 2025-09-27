import { Semigroup } from '../../typeclasses/Semigroup'
import { Result, succeed } from './result'
import { isFailure } from './refinements'
import { successOf } from './utils'
import { pipe } from '../../utils/flow'

export const getSemigroup: {
  <A, E>(Semigroup: Semigroup<A>): Semigroup<Result<A, E>>
} = Semigroup => ({
  combine: my => mx => {
    if (isFailure(mx) && isFailure(my)) {
      return mx
    }

    if (isFailure(mx)) {
      return my
    }

    if (isFailure(my)) {
      return mx
    }

    return pipe(mx, successOf, Semigroup.combine(successOf(my)), succeed)
  },
})
