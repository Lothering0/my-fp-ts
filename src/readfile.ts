import * as IO from "./modules/io"
import * as O from "./modules/option"
import { _, pipe } from "./utils"

type LogCharOn_ = (a: string) => (n: number) => IO.IO<void>
const logCharOn_: LogCharOn_ = chars => index =>
  chars[index] ? IO.writeToStdout_ (chars[index]) : IO.pure (_)

type LogChars_ = (a: string) => (n: number) => IO.IO<void>
const logChars_: LogChars_ = chars => index =>
  chars.length === index - 1
    ? logCharOn_ (chars) (index)
    : pipe (
        IO.Do,
        () => logCharOn_ (chars) (index),
        () => IO.wait_ (10),
        () => logChars_ (chars) (index + 1),
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
      fileContent => logChars_ (fileContent) (0),
    ),
  ),
)
