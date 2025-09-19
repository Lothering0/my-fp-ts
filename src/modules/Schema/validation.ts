import * as result from "../Result"
import { constant } from "../../utils/constant"
import { Schema } from "./schema"

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

export const validate: {
  <A>(self: Schema<A>): (a: A) => result.Result<ReadonlyArray<string>, A>
} = self => a => {
  const { isValid, messages } = self.validate (a)
  if (isValid) {
    return result.succeed (a)
  }
  return result.fail (messages)
}

export const validateUnknown =
  <A>(self: Schema<A>) =>
  (a: unknown): result.Result<ReadonlyArray<string>, A> => {
    const { isValid, messages } = self.validate (a)
    if (isValid) {
      return result.succeed (a as A)
    }
    return result.fail (messages)
  }
