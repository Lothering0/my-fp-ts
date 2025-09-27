import * as Result from '../Result'
import * as Option from '../Option'
import * as Array from '../ReadonlyArray'
import * as String from '../String'
import { constant } from '../../utils/constant'
import { Schema } from './schema'
import { flow, pipe } from '../../utils/flow'
import { isString } from '../../utils/typeChecks'

export type ProcessResult<Out> = Result.Result<ReadonlyArray<string>, Out>

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
  <In, Out = In>(self: Schema<In, Out>): (a: In) => ProcessResult<Out>
} = self => a => self.proceed(a)

export const proceedOption: {
  <In, Out = In>(self: Schema<In, Out>): (a: In) => Option.Option<Out>
} = self => flow(proceed(self), Option.fromResult)

export const validate: {
  <In, Out = In>(self: Schema<In, Out>): (a: In) => boolean
} = self => flow(proceed(self), Result.isSuccess)

export const proceedUnknown =
  <Out>(self: Schema<unknown, Out>) =>
  (a: unknown): Result.Result<ReadonlyArray<string>, Out> =>
    pipe(a as Out, proceed(self))

export const proceedUnknownOption: {
  <Out>(self: Schema<unknown, Out>): (a: unknown) => Option.Option<Out>
} = proceedOption

export const validateUnknown: {
  <Out>(self: Schema<unknown, Out>): (a: unknown) => boolean
} = validate
