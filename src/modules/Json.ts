import * as Result from './Result'
import { tryDo } from '../utils/exceptions'
import { pipe } from '../utils/flow'

export type Json =
  | number
  | string
  | boolean
  | null
  | ReadonlyArray<Json>
  | { readonly [key in string]: Json }

export class JsonParseError extends SyntaxError {
  constructor(message: string) {
    super(message)
    this.name = 'JsonParseError'
  }
}

export const parse: {
  (json: string): Result.Result<JsonParseError, Json>
} = json =>
  pipe(
    tryDo<SyntaxError, Json>(() => JSON.parse(json)),
    Result.catchAll(({ message }) =>
      pipe(new JsonParseError(message), Result.fail),
    ),
  )

export const stringify: {
  (value: Json): string
} = value => JSON.stringify(value)
