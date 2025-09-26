import * as option from '../Option'
import { flow } from '../../utils/flow'
import { execute, SyncOption } from './sync-option'

export const match: {
  <A, B, C = B>(
    matchers: option.Matchers<A, B, C>,
  ): (self: SyncOption<A>) => B | C
} = matchers => flow(execute, option.match(matchers))
