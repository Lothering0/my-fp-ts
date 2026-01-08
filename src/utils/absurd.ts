import { TaggedError } from '../modules/Exception'
import { raise } from './exceptions'

export class AbsurdException extends TaggedError('AbsurdException') {}

export const absurd: {
  <Out>(_?: never): Out
} = _ => {
  const message = JSON.stringify({ message: 'Absurd called', value: _ })
  raise(new AbsurdException(message))
}
