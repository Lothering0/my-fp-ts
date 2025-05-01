import * as A from "./modules/array"
import * as T from "./modules/task"
import * as TE from "./modules/task-either"
import * as IO from "./modules/io"
import * as O from "./modules/option"
import * as E from "./modules/either"
import * as I from "./modules/identity"
import * as P from "./modules/predicate"
import { inspect } from "util"
import { URIS } from "./types/Kind"
import { Monad } from "./types/Monad"
import { HKT } from "./types/HKT"
import { Functor } from "./types/Functor"
import { pipe } from "./utils/pipe"
import { wait } from "./utils/wait/task"
import { log_ } from "./utils/console"

const effect = pipe (
  TE.Do,
  TE.bindTo ("x", () => TE.pure (5)),
  TE.tapTask (() => wait (2000)),
  TE.bindTo ("y", () => TE.taskLeft (3)),
  TE.tapIo (({ x }) => log_ (x)),
)
TE.bimap (effect, log_, log_) ()
