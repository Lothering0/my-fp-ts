import { Separated } from "./separated"

type Make = <E, A>(left: E, right: A) => Separated<E, A>
export const make: Make = (left, right) => ({ left, right })
