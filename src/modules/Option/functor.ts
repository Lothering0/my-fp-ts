import * as Functor_ from '../../typeclasses/Functor'
import { Hkt, Option, some, none } from './option'
import { flow } from '../../utils/flow'
import { match } from './matchers'

export const Functor = Functor_.create<Hkt>({
  map: fab =>
    match({
      onNone: none,
      onSome: flow(fab, some),
    }),
})

export const map: {
  <A, B>(ab: (a: A) => B): (option: Option<A>) => Option<B>
} = Functor.map

export const as: {
  <A>(a: A): (option: Option<unknown>) => Option<A>
} = Functor.as
