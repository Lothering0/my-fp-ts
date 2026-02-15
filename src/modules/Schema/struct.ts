import * as Result from '../Result'
import * as String from '../String'
import * as Array from '../ReadonlyArray'
import * as Record from '../ReadonlyRecord'
import { create, Schema, SchemaOptional, Type } from './schema'
import { pipe } from '../../utils/flow'
import { hole } from '../../utils/hole'
import { isRecord, isUndefined } from '../../utils/typeChecks'
import { message } from './process'
import { optional } from './utils'
import { Prettify } from '../../types/utils'

export interface StructSchema<
  Out extends Record.ReadonlyRecord<string, Schema<unknown>>,
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
  A extends Record.ReadonlyRecord<string, Schema<unknown>>,
>(
  schemasByKey: A,
): StructSchema<A> => ({
  In: hole(),
  Type: hole(),
  isOptional: false,
  schemasByKey,
  proceed: x => {
    if (!isRecord(x)) {
      return Result.fail([message`value ${x} is not a struct`])
    }

    const DifferenceMagma = Array.getDifferenceMagma(String.Equivalence)
    const excessiveKeys = pipe(
      x,
      Record.keys,
      DifferenceMagma.combine(pipe(schemasByKey, Record.keys)),
    )

    if (Array.isNonEmpty(excessiveKeys)) {
      return pipe(
        excessiveKeys,
        Array.map(key => message`property ${key} should not exist`),
        Result.fail,
      )
    }

    const missingKeys = pipe(
      schemasByKey,
      Record.keys,
      Array.filter(k => !schemasByKey[k]?.isOptional),
      DifferenceMagma.combine(pipe(x, Record.keys)),
    )

    if (Array.isNonEmpty(missingKeys)) {
      return pipe(
        missingKeys,
        Array.map(key => message`property ${key} is required`),
        Result.fail,
      )
    }

    const out: Partial<Record<string, unknown>> = {}
    let messages: string[] = []

    for (const k in x) {
      const processResult = schemasByKey[k]!.proceed(x[k])

      if (Result.isFailure(processResult)) {
        const msgs = pipe(
          processResult,
          Result.failureOf,
          Array.map(msg => `${message`on property ${k}`}: ${msg}`),
        )
        messages = [...messages, ...msgs]
        continue
      }

      out[k] = Result.successOf(processResult)
    }

    if (Array.isNonEmpty(messages)) {
      return Result.fail(messages)
    }

    return Result.succeed(out as Type<StructSchema<A>>)
  },
})

export const keyof: {
  <A extends Record.ReadonlyRecord<string, Schema<unknown>>>(
    schema: StructSchema<A>,
  ): Schema<keyof A>
} = schema => {
  const keys = Object.keys(schema.schemasByKey)

  return create((x: string) => {
    if (keys.includes(x)) {
      return Result.succeed(x)
    }

    return Result.fail([
      `${message`got ${x}, expected one of the following values`}: ${keys.map(key => `"${key}"`).join(', ')}`,
    ])
  })
}

export const omit: {
  <
    A extends Record.ReadonlyRecord<string, Schema<unknown>>,
    K extends ReadonlyArray<keyof A>,
  >(
    ...keys: K
  ): (schema: StructSchema<A>) => StructSchema<Omit<A, K[number]>>
} =
  (...keys) =>
  schema =>
    pipe(schema.schemasByKey, Record.omit(...keys), Struct)

export const pick: {
  <
    A extends Record.ReadonlyRecord<string, Schema<unknown>>,
    K extends ReadonlyArray<keyof A>,
  >(
    ...keys: K
  ): (schema: StructSchema<A>) => StructSchema<Pick<A, K[number]>>
} =
  (...keys) =>
  schema =>
    pipe(schema.schemasByKey, Record.pick(...keys), Struct)

export const partial: {
  <A extends Record.ReadonlyRecord<string, Schema<unknown>>>(
    schema: StructSchema<A>,
  ): StructSchema<{ [K in keyof A]: SchemaOptional<Type<A[K]>> }>
} = schema => pipe(schema.schemasByKey, Record.map(optional), Struct) as any

export const required: {
  <A extends Record.ReadonlyRecord<string, Schema<unknown>>>(
    schema: StructSchema<A>,
  ): StructSchema<{ [K in keyof A]: Schema<Type<A[K]>> }>
} = schema =>
  pipe(
    schema.schemasByKey,
    Record.map(
      (schema): Schema<unknown> => ({
        In: hole(),
        Type: hole(),
        isOptional: false,
        schemasByKey: schema.schemasByKey,
        proceed: x => {
          if (isUndefined(x)) {
            return Result.fail([message`value is undefined`])
          }

          return Result.succeed(x)
        },
      }),
    ),
    Struct,
  ) as any

export const intersection: {
  <A extends Record.ReadonlyRecord<string, Schema<unknown>>>(
    schema: StructSchema<A>,
  ): <B extends Record.ReadonlyRecord<string, Schema<unknown>>>(
    selfSchema: StructSchema<B>,
  ) => StructSchema<A & B>
} = schema => selfSchema =>
  Struct({
    ...selfSchema.schemasByKey,
    ...schema.schemasByKey,
  })
