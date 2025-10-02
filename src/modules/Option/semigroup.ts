import { Monad } from './monad'
import { Option } from './option'
import { Semigroup } from '../../typeclasses/Semigroup'
import { isNone } from './refinements'
import { pipe } from '../../utils/flow'

export const getOptionSemigroup: {
  <A>(Semigroup: Semigroup<A>): Semigroup<Option<A>>
} = Semigroup => ({
  combine: mx => my => {
    if (isNone(mx)) {
      return my
    }

    if (isNone(my)) {
      return mx
    }

    return pipe(
      Monad.Do,
      Monad.apS('x', mx),
      Monad.apS('y', my),
      Monad.map(({ x, y }) => Semigroup.combine(y)(x)),
    )
  },
})
