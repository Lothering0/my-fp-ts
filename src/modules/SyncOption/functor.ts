import * as Option from '../Option'
import * as Functor_ from '../../typeclasses/Functor'
import { SyncOptionHkt, execute, SyncOption } from './sync-option'
import { pipe } from '../../utils/flow'

export const Functor: Functor_.Functor<SyncOptionHkt> = {
  map: ab => self => () => pipe(self, execute, Option.map(ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: SyncOption<A>) => SyncOption<B>
} = Functor.map
