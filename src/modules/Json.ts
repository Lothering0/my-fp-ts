import * as result from "./Result"
import { tryDo } from "../utils/exceptions"
import { pipe } from "../utils/flow"

export type Json =
  | number
  | string
  | boolean
  | null
  | ReadonlyArray<Json>
  | { readonly [key in string]: Json }

export class JsonParseError extends SyntaxError {
  constructor(message: string) {
    super (message)
    this.name = "JsonParseError"
  }
}

export const parse: {
  (json: string): result.Result<JsonParseError, Json>
} = json =>
  pipe (
    tryDo<SyntaxError, Json> (() => JSON.parse (json)),
    result.catchAll (({ message }) =>
      pipe (new JsonParseError (message), result.fail),
    ),
  )

export const stringify: {
  (value: Json): string
} = value => JSON.stringify (value)
