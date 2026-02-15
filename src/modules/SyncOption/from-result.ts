import { FromResult as FromResult_ } from '../../typeclasses/FromResult'
import { Result } from '../Result'
import { SyncOption, Hkt } from './sync-option'
import { _SyncOption } from './_internal'

export const FromResult: FromResult_<Hkt> = _SyncOption.FromResult

export const fromResult: {
  <A, E>(result: Result<A, E>): SyncOption<A>
} = FromResult.fromResult
