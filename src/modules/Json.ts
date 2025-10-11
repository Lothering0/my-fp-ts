import * as Result from './Result'
import { tryDo } from '../utils/exceptions'
import { pipe } from '../utils/flow'
import { TaggedSyntaxError } from './Exception'

export type Json =
  | number
  | string
  | boolean
  | null
  | ReadonlyArray<Json>
  | { readonly [key in string]: Json }

export class JsonParseError extends TaggedSyntaxError('JsonParseError') {}

export const parse: {
  (json: string): Result.Result<Json, JsonParseError>
} = json =>
  pipe(
    tryDo<Json, SyntaxError>(() => JSON.parse(json)),
    Result.catchAll(({ message }) =>
      pipe(new JsonParseError(message), Result.fail),
    ),
  )

export const stringify: {
  (value: Json): string
} = value => JSON.stringify(value)
