import * as async from "../modules/Async"
import { createInterface } from "node:readline"

export const ask: {
  (question: string): async.Async<string>
} = question => () => {
  const readlineInterface = createInterface ({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise (resolve =>
    readlineInterface.question (question, answer => {
      readlineInterface.close ()
      resolve (answer)
    }),
  )
}
