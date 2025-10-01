import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { Reader, ReaderHkt } from './reader'
import { constant } from '../../utils/constant'

export const FromIdentity: FromIdentity_<ReaderHkt> = {
  of: constant,
}

export const of: {
  <R, A>(a: A): Reader<R, A>
} = FromIdentity.of
