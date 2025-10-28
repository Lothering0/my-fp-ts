import * as Sync from '../Sync'
import { Hkt } from '../../typeclasses/Hkt'

export interface AsyncHkt extends Hkt {
  readonly Type: Async<this['In']>
}

export interface Async<A> extends Sync.Sync<Promise<A>> {}

export const async: {
  <A>(a: A): Async<A>
} = a => () => Promise.resolve(a)

export const toPromise: {
  <A>(ma: Async<A>): Promise<A>
} = ma => ma()

/** Alias for `toPromise` */
export const run = toPromise
