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
  <Out, In = Out>(self: Schema<Out, In>): (a: In) => ProcessResult<Out>
} = self => a => self.proceed (a)

export const proceedOption: {
  <Out, In = Out>(self: Schema<Out, In>): (a: In) => option.Option<Out>
} = self => flow (proceed (self), option.fromResult)

export const validate: {
  <Out, In = Out>(self: Schema<Out, In>): (a: In) => boolean
} = self => flow (proceed (self), result.isSuccess)

export const proceedUnknown =
  <Out>(self: Schema<Out, unknown>) =>
  (a: unknown): result.Result<ReadonlyArray<string>, Out> =>
    pipe (a as Out, proceed (self))

export const proceedUnknownOption: {
  <Out>(self: Schema<Out, unknown>): (a: unknown) => option.Option<Out>
} = proceedOption

export const validateUnknown: {
  <Out>(self: Schema<Out, unknown>): (a: unknown) => boolean
} = validate
