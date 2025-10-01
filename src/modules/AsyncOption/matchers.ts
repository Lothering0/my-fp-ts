import * as Option from '../Option'
import { Async } from '../Async'
import { toPromise, AsyncOption } from './async-option'

export const match: {
  <A, B, C = B>(
    matchers: Option.Matchers<A, B, C>,
  ): (self: AsyncOption<A>) => Async<B | C>
} = matchers => self => () => toPromise(self).then(Option.match(matchers))
