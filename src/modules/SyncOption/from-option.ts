import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { Option } from '../Option'
import { SyncOption, SyncOptionHkt } from './sync-option'
import { _SyncOption } from './_internal'

export const FromOption: FromOption_<SyncOptionHkt> = _SyncOption.FromOption

export const fromOption: {
  <A>(option: Option<A>): SyncOption<A>
} = FromOption.fromOption
