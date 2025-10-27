import * as Sync from '../Sync'
import * as Option from '../Option'
import { Hkt } from '../../typeclasses/Hkt'
import { _SyncOption } from './_internal'

export interface SyncOptionHkt extends Hkt {
  readonly Type: SyncOption<this['In']>
}

export interface SyncOption<A> extends Sync.Sync<Option.Option<A>> {}

export interface SyncOptionGenerator<A> {
  (
    make: <B>(self: SyncOption<B>) => SyncOptionIterable<B>,
  ): Generator<unknown, A>
}

export interface SyncOptionIterable<A> {
  readonly [Symbol.iterator]: Option.OptionGenerator<A>
}

export const none: {
  <A = never>(): SyncOption<A>
} = _SyncOption.none

export const some: {
  <A>(a: A): SyncOption<A>
} = _SyncOption.some

const try_: {
  <A>(operation: () => A): SyncOption<A>
} = operation => () => {
  try {
    return Option.some(operation())
  } catch {
    return Option.none()
  }
}

export { try_ as try }

export const fromSync: {
  <A>(ma: Sync.Sync<A>): SyncOption<A>
} = ma => () => Option.some(ma())

export const execute: {
  <A>(ma: SyncOption<A>): Option.Option<A>
} = <A>(ma: SyncOption<A>) => ma()

const makeIterable: {
  <A>(self: SyncOption<A>): SyncOptionIterable<A>
} = self => ({
  *[Symbol.iterator]() {
    const a = yield* self()
    return a
  },
})

export const gen: {
  <A>(generator: SyncOptionGenerator<A>): SyncOption<A>
} = generator => () => {
  const { value, done } = generator(makeIterable).next()
  if (!done) {
    return Option.none()
  }
  return Option.some(value)
}
