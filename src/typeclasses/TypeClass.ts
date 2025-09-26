import { Hkt } from './Hkt'

export interface TypeClass<F extends Hkt> {
  readonly _F?: F
}
