import * as boolean from "../Boolean"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isObject, isUndefined } from "../../utils/typeChecks"
import { Schema, SchemaOptional } from "./schema"
import { constValid, invalid, valid } from "./validation"

export const exact: {
  <const A>(a: A): Schema<A>
} = a => ({
  Type: hole (),
  validate: x =>
    pipe (
      a === x,
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([`value ${x} is not equal to ${a}`]),
      }),
    ),
})

export const optional: {
  <A>(schema: Schema<A>): SchemaOptional<A | undefined>
} = schema => ({
  Type: hole (),
  isOptional: true,
  schemasByKey: schema.schemasByKey,
  validate: x => {
    if (isUndefined (x)) {
      return valid
    }

    return schema.validate (x)
  },
})

export const instanceOf: {
  <A>(constructor: new (...args: unknown[]) => A): Schema<A>
} = constructor => ({
  Type: hole (),
  validate: x =>
    pipe (
      x instanceof constructor,
      boolean.match ({
        onTrue: constValid,
        onFalse: () =>
          invalid ([`value ${x} is not instance of ${constructor.name}`]),
      }),
    ),
})

export const union: {
  <A>(that: Schema<A>): <B>(self: Schema<B>) => Schema<A | B>
} = that => self => ({
  Type: hole (),
  validate: x => {
    const selfResult = self.validate (x)
    const thatResult = that.validate (x)

    return {
      isValid: selfResult.isValid || thatResult.isValid,
      messages: thatResult.isValid ? selfResult.messages : thatResult.messages,
    }
  },
})

export const intersection: {
  <A>(that: Schema<A>): <B>(self: Schema<B>) => Schema<A & B>
} = that => self => {
  if (!isObject (that.schemasByKey) || !isObject (self.schemasByKey)) {
    return {
      Type: hole (),
      validate: x => {
        const selfResult = self.validate (x)
        const thatResult = that.validate (x)

        return {
          isValid: selfResult.isValid && thatResult.isValid,
          messages: [...selfResult.messages, ...thatResult.messages],
        }
      },
    }
  }

  return {
    Type: hole (),
    schemasByKey: {
      ...self.schemasByKey,
      ...that.schemasByKey,
    },
    validate: x => {
      const selfResult = self.validate (x)
      const thatResult = that.validate (x)

      return {
        isValid: selfResult.isValid && thatResult.isValid,
        messages: [...selfResult.messages, ...thatResult.messages],
      }
    },
  }
}
