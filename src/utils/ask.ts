import * as Async from '../modules/Async'
import { createInterface } from 'node:readline'

export const ask: {
  (question: string): Async.Async<string>
} = question => () => {
  const readlineInterface = createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise(resolve =>
    readlineInterface.question(question, answer => {
      readlineInterface.close()
      resolve(answer)
    }),
  )
}
