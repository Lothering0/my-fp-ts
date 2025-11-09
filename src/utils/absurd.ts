import { TaggedError } from '../modules/Exception'
import { raise } from './exceptions'

export class AbsurdException extends TaggedError('AbsurdException') {}

export const absurd: {
  <Out>(_?: never): Out
} = () => raise(new AbsurdException('Absurd called'))
