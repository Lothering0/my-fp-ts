import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { _SyncOption } from './_internal'

export const FromResult: FromResult_<SyncOptionHkt> = _SyncOption.FromResult

export const fromResult: {
  <A, E>(ma: Result<A, E>): SyncOption<A>
} = FromResult.fromResult
