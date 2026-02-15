import { Hkt as Hkt_ } from '../../typeclasses/Hkt'

export interface Hkt extends Hkt_ {
  readonly Type: Sync<this['In']>
}

export interface Sync<A> {
  (): A
}

export const sync: {
  <A>(a: A): Sync<A>
} = a => () => a

export const run: {
  <A>(sync: Sync<A>): A
} = sync => sync()
