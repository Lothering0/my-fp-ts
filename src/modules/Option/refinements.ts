import { Option, None, Some } from './option'
import { isRecord } from '../../utils/typeChecks'

export const isOption = (x: unknown): x is Option<unknown> => {
  if (!isRecord(x)) {
    return false
  }
  return x._id === 'Option'
}

export const isSome: {
  <A>(option: Option<A>): option is Some<A>
} = option => option._tag === 'Some'

export const isNone: {
  <A>(option: Option<A>): option is None
} = option => option._tag === 'None'
