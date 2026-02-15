import * as Sync from '../Sync'
import * as Option from '../Option'
import { Hkt as Hkt_ } from '../../typeclasses/Hkt'
import { _SyncOption } from './_internal'

export interface Hkt extends Hkt_ {
  readonly Type: SyncOption<this['In']>
}

export interface SyncOption<A> extends Sync.Sync<Option.Option<A>> {}

export interface SyncOptionGenerator<A> {
  (
    make: <B>(syncOption: SyncOption<B>) => SyncOptionIterable<B>,
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
  <A>(sync: Sync.Sync<A>): SyncOption<A>
} = sync => () => Option.some(sync())

export const run: {
  <A>(syncOption: SyncOption<A>): Option.Option<A>
} = <A>(syncOption: SyncOption<A>) => syncOption()

const makeIterable: {
  <A>(syncOption: SyncOption<A>): SyncOptionIterable<A>
} = syncOption => ({
  *[Symbol.iterator]() {
    const a = yield* syncOption()
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
