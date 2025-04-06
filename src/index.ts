import * as A from "./modules/array"
import * as T from "./modules/task"
import * as IO from "./modules/io"
import * as O from "./modules/option"
import { add, compose, pipe } from "./utils"

const M = T.getRaceMonoid<string> ()

pipe (
  T.Do,
  () =>
    M.concat (
      M.concat (
        pipe (
          T.pure ("a"),
          T.tap (() => T.wait (20)),
        ),
        pipe (
          T.pure ("b"),
          T.tap (() => T.wait (10)),
        ),
      ),
      pipe (
        T.pure ("c"),
        T.tap (() => T.wait (100)),
      ),
    ),
  T.tapIo (IO.log),
)
