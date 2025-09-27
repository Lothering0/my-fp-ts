import * as Option from '../Option'
import { flow } from '../../utils/flow'
import { execute, SyncOption } from './sync-option'

export const match: {
  <A, B, C = B>(
    matchers: Option.Matchers<A, B, C>,
  ): (self: SyncOption<A>) => B | C
} = matchers => flow(execute, Option.match(matchers))
