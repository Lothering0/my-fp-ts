import * as result from "../Result"
import * as option from "../Option"
import * as readonlyArray from "../ReadonlyArray"
import * as string from "../String"
import { constant } from "../../utils/constant"
import { Schema } from "./schema"
import { flow, pipe } from "../../utils/flow"
import { isString } from "../../utils/typeChecks"

export interface ValidationResult {
  readonly isValid: boolean
  readonly messages: ReadonlyArray<string>
}

export const valid: ValidationResult = {
  isValid: true,
  messages: [],
}

export const constValid = constant (valid)

export const invalid: {
  (messages: ReadonlyArray<string>): ValidationResult
} = messages => ({
  isValid: false,
  messages,
})

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

export const check: {
  <A>(self: Schema<A>): (a: A) => result.Result<ReadonlyArray<string>, A>
} = self => a => {
  const { isValid, messages } = self.validate (a)
  if (isValid) {
    return result.succeed (a)
  }
  return result.fail (messages)
}

export const checkOption: {
  <A>(self: Schema<A>): (a: A) => option.Option<A>
} = self => flow (check (self), option.fromResult)

export const validate: {
  <A>(self: Schema<A>): (a: A) => boolean
} = self => flow (check (self), result.isSuccess)

export const checkUnknown =
  <A>(self: Schema<A>) =>
  (a: unknown): result.Result<ReadonlyArray<string>, A> =>
    pipe (a as A, check (self))

export const checkUnknownOption: {
  <A>(self: Schema<A>): (a: unknown) => option.Option<A>
} = checkOption

export const validateUnknown: {
  <A>(self: Schema<A>): (a: unknown) => boolean
} = validate
