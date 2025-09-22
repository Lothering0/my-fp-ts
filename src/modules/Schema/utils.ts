import * as boolean from "../Boolean"
import * as equivalence from "../../typeclasses/Equivalence"
import { pipe } from "../../utils/flow"
import { isObject, isUndefined } from "../../utils/typeChecks"
import { create, Schema, SchemaOptional } from "./schema"
import { constValid, invalid, message, valid } from "./validation"
import { LazyArg } from "../../types/utils"
import { hole } from "../../utils/hole"

export const equals: {
  <A>(Equivalence: equivalence.Equivalence<A>): (a: A) => Schema<A>
} = Equivalence => a =>
  create (x =>
    pipe (
      x,
      Equivalence.equals (a),
      boolean.match ({
        onTrue: constValid,
        onFalse: () => invalid ([message`value ${x} is not equal to ${a}`]),
      }),
    ),
  )

export const exact = <const A>(a: A): Schema<A> =>
  pipe (a, equals<A> (equivalence.EquivalenceStrict))

export const lazy = <A>(schema: LazyArg<Schema<A>>): Schema<A> => {
  const finalSchema: Schema<A> = create (x => {
    const currentSchema = schema ()
    const writableSchema: {
      -readonly [K in keyof Schema<unknown>]: Schema<unknown>[K]
    } = finalSchema
    writableSchema.isOptional = currentSchema.isOptional
    writableSchema.schemasByKey = currentSchema.schemasByKey
    return currentSchema.validate (x)
  })

  return finalSchema
}

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
} = constructor =>
  create (x =>
    pipe (
      x instanceof constructor,
      boolean.match ({
        onTrue: constValid,
        onFalse: () =>
          invalid ([
            message`value ${x} is not an instance of ${constructor.name}`,
          ]),
      }),
    ),
  )

export const union: {
  <A>(that: Schema<A>): <B>(self: Schema<B>) => Schema<A | B>
} = that => self =>
  create (x => {
    const selfResult = self.validate (x)
    const thatResult = that.validate (x)
    const isValid = selfResult.isValid || thatResult.isValid

    return {
      isValid,
      messages: isValid ? [] : [...selfResult.messages, ...thatResult.messages],
    }
  })

export const intersection: {
  <A>(that: Schema<A>): <B>(self: Schema<B>) => Schema<A & B>
} = that => self => {
  if (!isObject (that.schemasByKey) || !isObject (self.schemasByKey)) {
    return create (x => {
      const selfResult = self.validate (x)
      const thatResult = that.validate (x)

      return {
        isValid: selfResult.isValid && thatResult.isValid,
        messages: [...selfResult.messages, ...thatResult.messages],
      }
    })
  }

  return create ({
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
  })
}

export const minLength: {
  (
    min: number,
  ): <A extends ReadonlyArray<unknown> | string>(self: Schema<A>) => Schema<A>
} = min => self =>
  create (x => {
    const { isValid, messages } = self.validate (x)
    if (!isValid) {
      return invalid (messages)
    }
    const { length } = x as { length: number }
    if (length < min) {
      return invalid ([
        `value length should not be less than ${min}, got ${length}`,
      ])
    }
    return valid
  })

export const maxLength: {
  (
    max: number,
  ): <A extends ReadonlyArray<unknown> | string>(self: Schema<A>) => Schema<A>
} = max => self =>
  create (x => {
    const { isValid, messages } = self.validate (x)
    if (!isValid) {
      return invalid (messages)
    }
    const { length } = x as { length: number }
    if (length > max) {
      return invalid ([
        `value length should not be greater than ${max}, got ${length}`,
      ])
    }
    return valid
  })
