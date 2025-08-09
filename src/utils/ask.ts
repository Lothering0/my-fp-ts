import * as identity from "../modules/Identity"
import * as async from "../modules/Async"
import { createInterface } from "node:readline"
import { pipe } from "./flow"

export const ask: {
  (question: string): async.Async<string>
} = question => () =>
  pipe (
    identity.Do,
    identity.apS ("promise", Promise.withResolvers<string> ()),
    identity.apS (
      "readlineInterface",
      createInterface ({ input: process.stdin, output: process.stdout }),
    ),
    identity.tap (({ readlineInterface, promise }) =>
      readlineInterface.question (question, answer => {
        readlineInterface.close ()
        promise.resolve (answer)
      }),
    ),
    identity.map (({ promise }) => promise.promise),
  )
