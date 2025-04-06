import * as IO from "./modules/io"
import * as O from "./modules/option"
import { _, pipe } from "./utils"

type LogCharOn = (a: string) => (n: number) => IO.IO<void>
const logCharOn: LogCharOn = chars => index =>
  chars[index] ? IO.writeToStdout (chars[index]) : IO.pure (_)

type LogChars = (a: string) => (n: number) => IO.IO<void>
const logChars: LogChars = chars => index =>
  chars.length === index - 1
    ? logCharOn (chars) (index)
    : pipe (
        IO.Do,
        () => logCharOn (chars) (index),
        () => IO.waitSync (10),
        () => logChars (chars) (index + 1),
      )

pipe (
  IO.Do,
  IO.bindTo ("maybeFileContent", () =>
    IO.readFileSync (`${__dirname}/../src/index.ts`),
  ),
  IO.tap (({ maybeFileContent }) =>
    O.option (
      maybeFileContent,
      () => IO.raise ("Something went wrong"),
      fileContent => logChars (fileContent) (0),
    ),
  ),
)
