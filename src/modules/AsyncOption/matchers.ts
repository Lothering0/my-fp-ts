import * as Option from '../Option'
import { Async } from '../Async'
import { toPromise, AsyncOption } from './async-option'

export const match: {
  <In, Out1, Out2 = Out1>(
    matchers: Option.Matchers<In, Out1, Out2>,
  ): (self: AsyncOption<In>) => Async<Out1 | Out2>
} = matchers => self => () => toPromise(self).then(Option.match(matchers))
