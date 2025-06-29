import { Separated } from "./separated"

export const make: {
  <E, A>(left: E, right: A): Separated<E, A>
} = (left, right) => ({ left, right })
