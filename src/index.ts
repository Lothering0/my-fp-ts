import * as IO from "./modules/io"
import { pipe } from "./utils"

pipe (
  IO.Do,
  IO.bindTo ("fileContent", () =>
    IO.readFileSync (`${__dirname}/../src/index.ts`),
  ),
  IO.tap (() => IO.waitSync (1200)),
  // IO.tap (({ fileContent }) => IO.log (fileContent)),
  IO.tap (({ fileContent }) => IO.log (fileContent)),
)
