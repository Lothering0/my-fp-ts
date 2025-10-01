import { FromIdentity as FromIdentity_ } from '../../typeclasses/FromIdentity'
import { State, StateHkt } from './state'

export const FromIdentity: FromIdentity_<StateHkt> = {
  of: a => s => [a, s],
}

export const of: {
  <S, A>(a: A): State<S, A>
} = FromIdentity.of
