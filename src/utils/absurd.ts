import { raise } from './exceptions'

export const absurd: {
  <Out>(_: never): Out
} = () => raise('Absurd called')
