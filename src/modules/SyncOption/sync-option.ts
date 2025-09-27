import * as Sync from '../Sync'
import * as Option from '../Option'
import { tryDo } from '../../utils/exceptions'
import { pipe } from '../../utils/flow'
import { Hkt } from '../../typeclasses/Hkt'

export interface SyncOptionHkt extends Hkt {
  readonly Type: SyncOption<this['In']>
}

export interface SyncOption<A> extends Sync.Sync<Option.Option<A>> {}

export const none: SyncOption<never> = Option.zero

export const some: {
  <A>(a: A): SyncOption<A>
} = a => () => Option.some(a)

export const fromSync: {
  <A>(ma: Sync.Sync<A>): SyncOption<A>
} = ma => () => pipe(ma, tryDo, Option.fromResult)

export const execute: {
  <A>(ma: SyncOption<A>): Option.Option<A>
} = <A>(ma: SyncOption<A>) => {
  try {
    return ma()
  } catch {
    return Option.none
  }
}
