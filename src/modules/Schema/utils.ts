import * as result from "../Result"
import * as boolean from "../Boolean"
import * as equivalence from "../../typeclasses/Equivalence"
import { pipe } from "../../utils/flow"
import { isObject, isUndefined } from "../../utils/typeChecks"
import { create, Schema, SchemaOptional } from "./schema"
import { message, ValidationResult } from "./validation"
import { LazyArg } from "../../types/utils"
import { hole } from "../../utils/hole"

export const equals =
  <A>(Equivalence: equivalence.Equivalence<A>) =>
  (a: A): Schema<A> =>
    create (x =>
      pipe (
        x,
        Equivalence.equals (a),
        boolean.match ({
          onTrue: () => result.succeed (x as A),
          onFalse: () =>
            result.fail ([message`value ${x} is not equal to ${a}`]),
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
      return result.succeed (x)
    }

    return schema.validate (x)
  },
})

export const instanceOf: {
  <A>(constructor: new (...args: unknown[]) => A): Schema<A>
} = constructor =>
  create (x => {
    if (x instanceof constructor) {
      return result.succeed (x)
    }

    return result.fail ([
      message`value ${x} is not an instance of ${constructor.name}`,
    ])
  })

export const union: {
  <A>(that: Schema<A>): <B>(self: Schema<B>) => Schema<A | B>
} = that => self =>
  create (x => {
    const selfResult = self.validate (x)
    const thatResult = that.validate (x)
    const isValid = result.isSuccess (selfResult) || result.isSuccess (thatResult)

    if (!isValid) {
      return result.fail ([
        ...result.failure (selfResult),
        ...result.failure (thatResult),
      ])
    }

    return pipe (thatResult, result.orElse (selfResult))
  })

const intersectionValidate =
  <A>(that: Schema<A>) =>
  <B>(self: Schema<B>) =>
  (x: unknown): ValidationResult<A & B> => {
    const selfResult = self.validate (x)
    const thatResult = that.validate (x)
    let messages: ReadonlyArray<string> = []

    if (result.isFailure (selfResult)) {
      messages = [...result.failure (selfResult)]
    }

    if (result.isFailure (thatResult)) {
      messages = [...messages, ...result.failure (thatResult)]
    }

    if (result.isFailure (selfResult) || result.isFailure (thatResult)) {
      return result.fail (messages)
    }

    return thatResult as ValidationResult<A & B>
  }

export const intersection: {
  <A>(that: Schema<A>): <B>(self: Schema<B>) => Schema<A & B>
} = that => self => {
  if (!isObject (that.schemasByKey) || !isObject (self.schemasByKey)) {
    return create (intersectionValidate (that) (self))
  }

  return create ({
    schemasByKey: {
      ...self.schemasByKey,
      ...that.schemasByKey,
    },
    validate: intersectionValidate (that) (self),
  })
}

export const minLength =
  (min: number) =>
  <A extends ReadonlyArray<unknown> | string>(self: Schema<A>): Schema<A> =>
    create (x => {
      const validationResult = self.validate (x)

      if (result.isFailure (validationResult)) {
        return validationResult
      }

      const { length } = x as { length: number }
      if (length < min) {
        return result.fail ([
          `value length should not be less than ${min}, got ${length}`,
        ])
      }
      return result.succeed (x as A)
    })

export const maxLength =
  (max: number) =>
  <A extends ReadonlyArray<unknown> | string>(self: Schema<A>): Schema<A> =>
    create (x => {
      const validationResult = self.validate (x)

      if (result.isFailure (validationResult)) {
        return validationResult
      }

      const { length } = x as { length: number }
      if (length > max) {
        return result.fail ([
          `value length should not be greater than ${max}, got ${length}`,
        ])
      }
      return result.succeed (x as A)
    })
