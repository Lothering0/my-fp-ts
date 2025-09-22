import * as option from "../../modules/Option"
import * as string from "../../modules/String"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { create, Schema, SchemaOptional, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isRecord, isUndefined } from "../../utils/typeChecks"
import { constValid, invalid, message, valid } from "./validation"
import { optional } from "./utils"
import { Prettify } from "../../types/utils"

export interface StructSchema<
  A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>,
> extends Schema<
    Prettify<
      {
        [K in keyof A as A[K] extends SchemaOptional<unknown>
          ? never
          : K]: Type<A[K]>
      } & {
        [K in keyof A as A[K] extends SchemaOptional<unknown>
          ? K
          : never]?: Type<A[K]>
      }
    >
  > {
  readonly schemasByKey: A
}

export const Struct: {
  <A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>>(
    schemasByKey: A,
  ): StructSchema<A>
} = schemasByKey => ({
  Type: hole (),
  isOptional: false,
  schemasByKey,
  validate: x => {
    if (!isRecord (x)) {
      return invalid ([message`value ${x} is not a struct`])
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
        readonlyArray.map (key => message`property ${key} should not exist`),
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
        readonlyArray.map (key => message`property ${key} is required`),
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
          readonlyArray.map (msg => `${message`on property ${k}`}: ${msg}`),
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
  <A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<A>,
  ): Schema<keyof A>
} = self => {
  const keys = Object.keys (self.schemasByKey)

  return create ((x: string) => {
    if (keys.includes (x)) {
      return valid
    }

    return invalid ([
      `${message`got ${x}, expected one of the following values`}: ${keys.map (key => `"${key}"`).join (", ")}`,
    ])
  })
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
    pipe (self.schemasByKey, readonlyRecord.omit (...keys), Struct)

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
    pipe (self.schemasByKey, readonlyRecord.pick (...keys), Struct)

export const partial: {
  <A extends readonlyRecord.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<A>,
  ): StructSchema<{ [K in keyof A]: SchemaOptional<Type<A[K]>> }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = self => pipe (self.schemasByKey, readonlyRecord.map (optional), Struct) as any

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
            return invalid ([message`value is undefined`])
          }

          return valid
        },
      }),
    ),
    Struct,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any
