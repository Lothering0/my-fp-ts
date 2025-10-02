import * as Sync from '../Sync'
import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { Option } from '../Option'
import { SyncOption, SyncOptionHkt } from './sync-option'

export const FromOption: FromOption_<SyncOptionHkt> = {
  fromOption: Sync.of,
}

export const fromOption: {
  <A>(ma: Option<A>): SyncOption<A>
} = FromOption.fromOption
