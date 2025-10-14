import * as Result from '../Result'
import * as Array from '../ReadonlyArray'
import { pipe } from '../../utils/flow'
import { create, Schema, SchemaOptional, Type } from './schema'
import { message } from './process'

type ExtractTupleTypes<A extends ReadonlyArray<Schema<unknown>>> = A extends [
  infer X,
  ...infer Xs,
]
  ? X extends SchemaOptional<unknown>
    ? Xs extends ReadonlyArray<Schema<unknown>>
      ? readonly [Type<X>?, ...ExtractTupleTypes<Xs>]
      : []
    : X extends Schema<unknown>
      ? Xs extends ReadonlyArray<Schema<unknown>>
        ? readonly [Type<X>, ...ExtractTupleTypes<Xs>]
        : []
      : []
  : []

export const Tuple = <A extends ReadonlyArray<Schema<unknown>>>(
  ...schemas: A
): Schema<ExtractTupleTypes<A>> =>
  // Explicitly define generic. Without it Jest sometimes fail tests at this place
  create<ExtractTupleTypes<A>>(xs => {
    const isArray = Array.Array.isArray(xs)

    if (!isArray) {
      return Result.fail([message`value ${xs} is not a tuple`])
    }

    const tupleMinLength = pipe(
      schemas,
      Array.dropRightWhile(({ isOptional }) => Boolean(isOptional)),
      Array.length,
    )
    const tupleMaxLength = schemas.length

    if (xs.length < tupleMinLength || xs.length > tupleMaxLength) {
      return Result.fail([
        message`tuple length must be from ${tupleMinLength} to ${tupleMaxLength}, got ${xs.length}`,
      ])
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: any = []

    for (const i in schemas) {
      const schema = schemas[i]!
      const processResult = schema.proceed(xs[i])

      if (Result.isFailure(processResult)) {
        return pipe(
          processResult,
          Result.mapLeft(Array.map(msg => `${message`on index ${i}`}: ${msg}`)),
        )
      }

      out.push(Result.successOf(processResult))
    }

    return Result.succeed(out)
  })
