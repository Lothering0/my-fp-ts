import * as Functor_ from '../../typeclasses/Functor'
import { OptionHkt, Option, some, none } from './option'
import { flow } from '../../utils/flow'
import { match } from './matchers'

export const Functor: Functor_.Functor<OptionHkt> = {
  map: fab =>
    match({
      onNone: none,
      onSome: flow(fab, some),
    }),
}

export const map: {
  <A, B>(ab: (a: A) => B): (self: Option<A>) => Option<B>
} = Functor.map
