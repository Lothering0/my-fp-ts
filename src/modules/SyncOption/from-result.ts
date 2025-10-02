import * as Option from '../Option'
import * as Sync from '../Sync'
import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { flow } from '../../utils/flow'

export const FromResult: FromResult_<SyncOptionHkt> = {
  fromResult: flow(Option.fromResult, Sync.of),
}

export const fromResult: {
  <A, E>(ma: Result<A, E>): SyncOption<A>
} = FromResult.fromResult
