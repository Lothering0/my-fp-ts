import * as Result from '../Result'
import * as Option from '../Option'
import * as Array from '../ReadonlyArray'
import * as String from '../String'
import { constant } from '../../utils/constant'
import { Schema } from './schema'
import { flow, pipe } from '../../utils/flow'
import { isString } from '../../utils/typeChecks'

export type ProcessResult<A> = Result.Result<A, ReadonlyArray<string>>

export const message: {
  (parts: TemplateStringsArray, ...values: ReadonlyArray<unknown>): string
} = (parts, ...values) =>
  pipe(
    parts,
    Array.reduce('', (out, part, i) => {
      const value = pipe(
        values,
        Array.lookup(i),
        Option.match({
          onNone: constant(''),
          onSome: a => {
            if (isString(a)) {
              return JSON.stringify(a)
            }
            return `\`${a}\``
          },
        }),
      )

      return pipe(out, String.concat(part), String.concat(value))
    }),
  )

export const proceed: {
  <In, Out = In>(schema: Schema<In, Out>): (a: In) => ProcessResult<Out>
} = schema => a => schema.proceed(a)

export const proceedOption: {
  <In, Out = In>(schema: Schema<In, Out>): (a: In) => Option.Option<Out>
} = schema => flow(proceed(schema), Option.fromResult)

export const validate: {
  <In, Out = In>(schema: Schema<In, Out>): (a: In) => boolean
} = schema => flow(proceed(schema), Result.isSuccess)

export const proceedUnknown =
  <A>(schema: Schema<unknown, A>) =>
  (a: unknown): Result.Result<A, ReadonlyArray<string>> =>
    pipe(a as A, proceed(schema))

export const proceedUnknownOption: {
  <Out>(schema: Schema<unknown, Out>): (a: unknown) => Option.Option<Out>
} = proceedOption

export const validateUnknown: {
  <Out>(schema: Schema<unknown, Out>): (a: unknown) => boolean
} = validate
