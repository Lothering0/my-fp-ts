import * as Option from '../Option'
import { flow } from '../../utils/flow'
import { run, SyncOption } from './sync-option'

export const match: {
  <A, B, C = B>(
    matchers: Option.Matchers<A, B, C>,
  ): (syncOption: SyncOption<A>) => B | C
} = matchers => flow(run, Option.match(matchers))
