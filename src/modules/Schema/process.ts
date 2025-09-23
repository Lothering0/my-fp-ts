import * as result from "../Result"
import * as option from "../Option"
import * as readonlyArray from "../ReadonlyArray"
import * as string from "../String"
import { constant } from "../../utils/constant"
import { Schema } from "./schema"
import { flow, pipe } from "../../utils/flow"
import { isString } from "../../utils/typeChecks"

export type ProcessResult<Out> = result.Result<ReadonlyArray<string>, Out>

export const message: {
  (parts: TemplateStringsArray, ...values: ReadonlyArray<unknown>): string
} = (parts, ...values) =>
  pipe (
    parts,
    readonlyArray.reduce ("", (out, part, i) => {
      const value = pipe (
        values,
        readonlyArray.lookup (i),
        option.match ({
          onNone: constant (""),
          onSome: a => {
            if (isString (a)) {
              return JSON.stringify (a)
            }
            return `\`${a}\``
          },
        }),
      )

      return pipe (out, string.concat (part), string.concat (value))
    }),
  )

export const proceed: {
  <A>(self: Schema<A>): (a: A) => ProcessResult<A>
} = self => a => self.proceed (a)

export const proceedOption: {
  <A>(self: Schema<A>): (a: A) => option.Option<A>
} = self => flow (proceed (self), option.fromResult)

export const validate: {
  <A>(self: Schema<A>): (a: A) => boolean
} = self => flow (proceed (self), result.isSuccess)

export const proceedUnknown =
  <A>(self: Schema<A>) =>
  (a: unknown): result.Result<ReadonlyArray<string>, A> =>
    pipe (a as A, proceed (self))

export const proceedUnknownOption: {
  <A>(self: Schema<A>): (a: unknown) => option.Option<A>
} = proceedOption

export const validateUnknown: {
  <A>(self: Schema<A>): (a: unknown) => boolean
} = validate
