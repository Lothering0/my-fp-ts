import { Hkt } from '../../typeclasses/Hkt'

export interface ReadonlyArrayHkt extends Hkt {
  readonly Type: ReadonlyArray<this['In']>
}

const ArrayConstructor = Array

export { ArrayConstructor as Array }
