import { Result, match } from '../modules/Result'
import { Option, fromResult, zero, some } from '../modules/Option'
import { Hkt, Kind } from './Hkt'
import { TypeClass } from './TypeClass'
import { Functor } from './Functor'
import { flow, pipe } from '../utils/flow'

export interface Compactable<F extends Hkt> extends TypeClass<F> {
  readonly compact: <Out, Collectable, Fixed>(
    self: Kind<F, Option<Out>, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
  readonly compactResults: <Out, Collectable, Fixed>(
    self: Kind<F, Result<unknown, Out>, Collectable, Fixed>,
  ) => Kind<F, Out, Collectable, Fixed>
  readonly separate: <Out1, Out2, Collectable, Fixed>(
    self: Kind<F, Result<Out1, Out2>, Collectable, Fixed>,
  ) => readonly [
    Kind<F, Out1, Collectable, Fixed>,
    Kind<F, Out2, Collectable, Fixed>,
  ]
}

export const create: {
  <F extends Hkt>(
    Functor: Functor<F>,
    Compactable: Pick<Compactable<F>, 'compact'> & Partial<Compactable<F>>,
  ): Compactable<F>
} = (Functor, Compactable) => ({
  compactResults: flow(Functor.map(fromResult), Compactable.compact),
  separate: self => [
    pipe(
      self,
      Functor.map(match({ onFailure: some, onSuccess: zero })),
      Compactable.compact,
    ),
    pipe(
      self,
      Functor.map(match({ onFailure: zero, onSuccess: some })),
      Compactable.compact,
    ),
  ],
  ...Compactable,
})
