import * as option from "../../modules/Option"
import * as string from "../../modules/String"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { Schema, SchemaOptional, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isRecord, isUndefined } from "../../utils/typeChecks"
import { constValid, invalid, valid } from "./validation"
import { optional } from "./utils"

export interface StructSchema<
  A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>,
> extends Schema<
    {
      [K in keyof A as A[K] extends SchemaOptional<unknown> ? never : K]: Type<
        A[K]
      >
    } & {
      [K in keyof A as A[K] extends SchemaOptional<unknown> ? K : never]?: Type<
        A[K]
      >
    }
  > {
  readonly schemasByKey: A
}

export const struct: {
  <A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>>(
    schemasByKey: A,
  ): StructSchema<A>
} = schemasByKey => ({
  Type: hole (),
  schemasByKey,
  validate: x => {
    if (!isRecord (x)) {
      return invalid ([`value \`${x}\` is not a struct`])
    }

    const DifferenceMagma = readonlyArray.getDifferenceMagma (string.Equivalence)
    const excessiveKeys = pipe (
      x,
      readonlyRecord.keys,
      DifferenceMagma.combine (pipe (schemasByKey, readonlyRecord.keys)),
    )

    if (readonlyArray.isNonEmpty (excessiveKeys)) {
      return pipe (
        excessiveKeys,
        readonlyArray.map (key => `key \`${key}\` should not exist`),
        invalid,
      )
    }

    const missingKeys = pipe (
      schemasByKey,
      readonlyRecord.keys,
      readonlyArray.filter (k => !schemasByKey[k]?.isOptional),
      DifferenceMagma.combine (pipe (x, readonlyRecord.keys)),
    )

    if (readonlyArray.isNonEmpty (missingKeys)) {
      return pipe (
        missingKeys,
        readonlyArray.map (key => `key \`${key}\` is required`),
        invalid,
      )
    }

    const invalidValueMessages = pipe (
      x,
      readonlyRecord.filterMap ((a, k) => {
        const validationResult = schemasByKey[k]!.validate (a)

        if (validationResult.isValid) {
          return option.none
        }

        return pipe (
          validationResult.messages,
          readonlyArray.map (message => `on property \`${k}\`: ${message}`),
          option.some,
        )
      }),
      readonlyRecord.values,
      readonlyArray.flat,
    )

    if (readonlyArray.isNonEmpty (invalidValueMessages)) {
      return invalid (invalidValueMessages)
    }

    return constValid ()
  },
})

export const keyof: {
  <A>(self: Schema<A>): Schema<keyof A>
} = self => {
  const keys = Object.keys (self)

  return {
    Type: hole (),
    validate: (x: string) => {
      if (keys.includes (x)) {
        return valid
      }

      return invalid ([
        `got \`${x}\`, expected one of the following values: ${keys.map (key => `\`${key}\``).join (", ")}`,
      ])
    },
  }
}

export const omit: {
  <
    A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>,
    K extends ReadonlyArray<keyof A>,
  >(
    ...keys: K
  ): (self: StructSchema<A>) => StructSchema<Omit<A, K[number]>>
} =
  (...keys) =>
  self =>
    pipe (self.schemasByKey, readonlyRecord.omit (...keys), struct)

export const pick: {
  <
    A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>,
    K extends ReadonlyArray<keyof A>,
  >(
    ...keys: K
  ): (self: StructSchema<A>) => StructSchema<Pick<A, K[number]>>
} =
  (...keys) =>
  self =>
    pipe (self.schemasByKey, readonlyRecord.pick (...keys), struct)

export const partial: {
  <A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<A>,
  ): StructSchema<{ [K in keyof A]: SchemaOptional<A[K]> }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = self => pipe (self.schemasByKey, readonlyRecord.map (optional), struct) as any

export const required: {
  <A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<A>,
  ): StructSchema<{ [K in keyof A]: Schema<A[K]> }>
} = self =>
  pipe (
    self.schemasByKey,
    readonlyRecord.map (
      (schema): Schema<unknown> => ({
        Type: hole (),
        isOptional: false,
        schemasByKey: schema.schemasByKey,
        validate: x => {
          if (isUndefined (x)) {
            return invalid ([`value is undefined`])
          }

          return valid
        },
      }),
    ),
    struct,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any
