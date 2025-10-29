import * as Contravariant_ from '../../typeclasses/Contravariant'
import { flow } from '../../utils/flow'
import { Reader, ReaderHkt } from './reader'

export const Contravariant: Contravariant_.Contravariant<ReaderHkt> = {
  contramap: ts => self => flow(ts, self),
}

export const contramap: {
  <T, S>(ts: (t: T) => S): <A>(self: Reader<S, A>) => Reader<T, A>
} = Contravariant.contramap
