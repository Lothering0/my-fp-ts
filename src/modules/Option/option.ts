import { Hkt } from '../../typeclasses/Hkt'

export interface OptionHkt extends Hkt {
  readonly Type: Option<this['In']>
}

export type Option<A> = None | Some<A>

export interface None {
  readonly _id: 'Option'
  readonly _tag: 'None'
}

export interface Some<A> {
  readonly _id: 'Option'
  readonly _tag: 'Some'
  readonly value: A
}

export const some: {
  <A>(a: A): Option<A>
} = value => ({
  _id: 'Option',
  _tag: 'Some',
  value,
})

export const none: Option<never> = {
  _id: 'Option',
  _tag: 'None',
}
