import { raise } from "./exceptions"

type Absurd = <A>(_: never) => A
export const absurd: Absurd = () => raise ("Absurd called")
