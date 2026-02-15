import * as Contravariant_ from '../../typeclasses/Contravariant'
import { Reader, ReaderHkt } from './reader'
import { local } from './utils'

export const Contravariant: Contravariant_.Contravariant<ReaderHkt> = {
  contramap: local,
}

export const contramap: {
  <T, S>(ts: (t: T) => S): <A>(reader: Reader<S, A>) => Reader<T, A>
} = Contravariant.contramap
