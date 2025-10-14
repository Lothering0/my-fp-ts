import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { Option } from '../Option'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { _SyncOption } from './internal'

export const FromOption: FromOption_<SyncOptionHkt> = _SyncOption.FromOption

export const fromOption: {
  <A>(ma: Option<A>): SyncOption<A>
} = FromOption.fromOption
