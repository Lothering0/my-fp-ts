import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { hole } from '../../utils/hole'

export interface Hkt extends Hkt_ {
  readonly Type: Option<this['In']>
}

export type Option<A> = (None | Some<A>) & {
  readonly [Symbol.iterator]: OptionGenerator<A>
}

export interface OptionGenerator<A> {
  (): Generator<unknown, A>
}

export interface None {
  readonly _id: 'Option'
  readonly _tag: 'None'
  readonly [Symbol.iterator]: OptionGenerator<never>
}

export interface Some<A> {
  readonly _id: 'Option'
  readonly _tag: 'Some'
  readonly value: A
  readonly [Symbol.iterator]: OptionGenerator<A>
}

const _none = Object.freeze<None>({
  _id: 'Option',
  _tag: 'None',
  *[Symbol.iterator]() {
    yield
    return hole()
  },
})

export const none: {
  <A = never>(): Option<A>
} = () => _none

export const some: {
  <A>(a: A): Option<A>
} = value =>
  Object.freeze({
    _id: 'Option',
    _tag: 'Some',
    value,
    *[Symbol.iterator]() {
      return value
    },
  })

export const gen: {
  <A>(generator: OptionGenerator<A>): Option<A>
} = generator => {
  const { value, done } = generator().next()
  if (!done) {
    return none()
  }
  return some(value)
}
