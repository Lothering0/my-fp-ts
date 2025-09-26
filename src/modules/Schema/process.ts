import * as result from '../Result'
import * as option from '../Option'
import * as array from '../ReadonlyArray'
import * as string from '../String'
import { constant } from '../../utils/constant'
import { Schema } from './schema'
import { flow, pipe } from '../../utils/flow'
import { isString } from '../../utils/typeChecks'

export type ProcessResult<Out> = result.Result<ReadonlyArray<string>, Out>

export const message: {
  (parts: TemplateStringsArray, ...values: ReadonlyArray<unknown>): string
} = (parts, ...values) =>
  pipe(
    parts,
    array.reduce('', (out, part, i) => {
      const value = pipe(
        values,
        array.lookup(i),
        option.match({
          onNone: constant(''),
          onSome: a => {
            if (isString(a)) {
              return JSON.stringify(a)
            }
            return `\`${a}\``
          },
        }),
      )

      return pipe(out, string.concat(part), string.concat(value))
    }),
  )

export const proceed: {
  <In, Out = In>(self: Schema<In, Out>): (a: In) => ProcessResult<Out>
} = self => a => self.proceed(a)

export const proceedOption: {
  <In, Out = In>(self: Schema<In, Out>): (a: In) => option.Option<Out>
} = self => flow(proceed(self), option.fromResult)

export const validate: {
  <In, Out = In>(self: Schema<In, Out>): (a: In) => boolean
} = self => flow(proceed(self), result.isSuccess)

export const proceedUnknown =
  <Out>(self: Schema<unknown, Out>) =>
  (a: unknown): result.Result<ReadonlyArray<string>, Out> =>
    pipe(a as Out, proceed(self))

export const proceedUnknownOption: {
  <Out>(self: Schema<unknown, Out>): (a: unknown) => option.Option<Out>
} = proceedOption

export const validateUnknown: {
  <Out>(self: Schema<unknown, Out>): (a: unknown) => boolean
} = validate
