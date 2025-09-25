import * as result from "../Result"
import * as string from "../String"
import * as array from "../ReadonlyArray"
import * as record from "../ReadonlyRecord"
import { create, Schema, SchemaOptional, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isRecord, isUndefined } from "../../utils/typeChecks"
import { message } from "./process"
import { optional } from "./utils"
import { Prettify } from "../../types/utils"

export interface StructSchema<
  Out extends record.ReadonlyRecord<string, Schema<unknown>>,
> extends Schema<
    Prettify<
      {
        [K in keyof Out as Out[K] extends SchemaOptional<unknown>
          ? never
          : K]: Type<Out[K]>
      } & {
        [K in keyof Out as Out[K] extends SchemaOptional<unknown>
          ? K
          : never]?: Type<Out[K]>
      }
    >
  > {
  readonly schemasByKey: Out
}

export const Struct = <
  A extends record.ReadonlyRecord<string, Schema<unknown>>,
>(
  schemasByKey: A,
): StructSchema<A> => ({
  _In: hole (),
  Type: hole (),
  isOptional: false,
  schemasByKey,
  proceed: x => {
    if (!isRecord (x)) {
      return result.fail ([message`value ${x} is not a struct`])
    }

    const DifferenceMagma = array.getDifferenceMagma (string.Equivalence)
    const excessiveKeys = pipe (
      x,
      record.keys,
      DifferenceMagma.combine (pipe (schemasByKey, record.keys)),
    )

    if (array.isNonEmpty (excessiveKeys)) {
      return pipe (
        excessiveKeys,
        array.map (key => message`property ${key} should not exist`),
        result.fail,
      )
    }

    const missingKeys = pipe (
      schemasByKey,
      record.keys,
      array.filter (k => !schemasByKey[k]?.isOptional),
      DifferenceMagma.combine (pipe (x, record.keys)),
    )

    if (array.isNonEmpty (missingKeys)) {
      return pipe (
        missingKeys,
        array.map (key => message`property ${key} is required`),
        result.fail,
      )
    }

    const out: Partial<Record<string, unknown>> = {}
    let messages: string[] = []

    for (const k in x) {
      const processResult = schemasByKey[k]!.proceed (x[k])

      if (result.isFailure (processResult)) {
        const msgs = pipe (
          processResult,
          result.failureOf,
          array.map (msg => `${message`on property ${k}`}: ${msg}`),
        )
        messages = [...messages, ...msgs]
        continue
      }

      out[k] = result.successOf (processResult)
    }

    if (array.isNonEmpty (messages)) {
      return result.fail (messages)
    }

    return result.succeed (out as Type<StructSchema<A>>)
  },
})

export const keyof: {
  <A extends record.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<A>,
  ): Schema<keyof A>
} = self => {
  const keys = Object.keys (self.schemasByKey)

  return create ((x: string) => {
    if (keys.includes (x)) {
      return result.succeed (x)
    }

    return result.fail ([
      `${message`got ${x}, expected one of the following values`}: ${keys.map (key => `"${key}"`).join (", ")}`,
    ])
  })
}

export const omit: {
  <
    A extends record.ReadonlyRecord<string, Schema<unknown>>,
    K extends ReadonlyArray<keyof A>,
  >(
    ...keys: K
  ): (self: StructSchema<A>) => StructSchema<Omit<A, K[number]>>
} =
  (...keys) =>
  self =>
    pipe (self.schemasByKey, record.omit (...keys), Struct)

export const pick: {
  <
    A extends record.ReadonlyRecord<string, Schema<unknown>>,
    K extends ReadonlyArray<keyof A>,
  >(
    ...keys: K
  ): (self: StructSchema<A>) => StructSchema<Pick<A, K[number]>>
} =
  (...keys) =>
  self =>
    pipe (self.schemasByKey, record.pick (...keys), Struct)

export const partial: {
  <A extends record.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<A>,
  ): StructSchema<{ [K in keyof A]: SchemaOptional<Type<A[K]>> }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = self => pipe (self.schemasByKey, record.map (optional), Struct) as any

export const required: {
  <A extends record.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<A>,
  ): StructSchema<{ [K in keyof A]: Schema<Type<A[K]>> }>
} = self =>
  pipe (
    self.schemasByKey,
    record.map (
      (schema): Schema<unknown> => ({
        _In: hole (),
        Type: hole (),
        isOptional: false,
        schemasByKey: schema.schemasByKey,
        proceed: x => {
          if (isUndefined (x)) {
            return result.fail ([message`value is undefined`])
          }

          return result.succeed (x)
        },
      }),
    ),
    Struct,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any

export const intersection: {
  <A extends record.ReadonlyRecord<string, Schema<unknown>>>(
    that: StructSchema<A>,
  ): <B extends record.ReadonlyRecord<string, Schema<unknown>>>(
    self: StructSchema<B>,
  ) => StructSchema<A & B>
} = that => self =>
  Struct ({
    ...self.schemasByKey,
    ...that.schemasByKey,
  })
