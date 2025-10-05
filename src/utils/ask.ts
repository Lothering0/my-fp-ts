import * as Effect from '../modules/Effect'
import { createInterface } from 'node:readline'

export const ask: {
  (question: string): Effect.Effect<string>
} = question =>
  Effect.fromAsync(() => {
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
  })
