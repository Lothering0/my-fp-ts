import * as Async from '../Async'
import { FromOption as FromOption_ } from '../../typeclasses/FromOption'
import { Option } from '../Option'
import { AsyncOption, AsyncOptionHkt } from './async-option'

export const FromOption: FromOption_<AsyncOptionHkt> = {
  fromOption: Async.of,
}

export const fromOption: {
  <A>(ma: Option<A>): AsyncOption<A>
} = FromOption.fromOption
