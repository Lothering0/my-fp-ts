import * as option from '../Option'
import * as functor from '../../typeclasses/Functor'
import { SyncOptionHkt, execute, SyncOption } from './sync-option'
import { pipe } from '../../utils/flow'

export const Functor: functor.Functor<SyncOptionHkt> = {
  map: ab => self => () => pipe(self, execute, option.map(ab)),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: SyncOption<A>) => SyncOption<B>
} = Functor.map
