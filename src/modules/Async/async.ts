import * as sync from '../Sync'
import { Hkt } from '../../typeclasses/Hkt'

export interface AsyncHkt extends Hkt {
  readonly Type: Async<this['In']>
}

export interface Async<In> extends sync.Sync<Promise<In>> {}

export const async: {
  <In>(a: In): Async<In>
} = a => () => Promise.resolve(a)

export const toPromise: {
  <In>(ma: Async<In>): Promise<In>
} = ma => ma()
