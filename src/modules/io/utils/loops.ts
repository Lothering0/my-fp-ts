import { _ } from "src/utils"
import { IO, io } from "../io"

type DoWhile = <A>(f: () => boolean) => (g: () => A) => IO<void>
export const doWhile: DoWhile = p => f => {
  while (p ()) f ()
  return io (_)
}
