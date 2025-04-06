import { _, compose, constant } from "src/utils"
import { io, IO } from "../io"

type Log = (a: unknown) => IO<void>
export const log: Log = compose (io, console.log)

type WriteToStdout = (a: string) => IO<void>
export const writeToStdout: WriteToStdout = compose (constant (io (_)), string =>
  process.stdout.write (string),
)
