import { raise } from "./exceptions"

export const absurd: {
  <A>(_: never): A
} = () => raise ("Absurd called")
