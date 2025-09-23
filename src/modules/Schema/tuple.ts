import * as result from "../Result"
import * as readonlyArray from "../ReadonlyArray"
import { pipe } from "../../utils/flow"
import { create, Schema, SchemaOptional, Type } from "./schema"
import { message } from "./process"

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
  create (xs => {
    const isArray = Array.isArray (xs)

    if (!isArray) {
      return result.fail ([message`value ${xs} is not a tuple`])
    }

    const tupleMinLength = pipe (
      schemas,
      readonlyArray.dropRightWhile (({ isOptional }) => Boolean (isOptional)),
      readonlyArray.length,
    )
    const tupleMaxLength = schemas.length

    if (xs.length < tupleMinLength || xs.length > tupleMaxLength) {
      return result.fail ([
        message`tuple length must be from ${tupleMinLength} to ${tupleMaxLength}, got ${xs.length}`,
      ])
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const out: any = []

    for (const i in schemas) {
      const schema = schemas[i]!
      const processResult = schema.proceed (xs[i])

      if (result.isFailure (processResult)) {
        return pipe (
          processResult,
          result.mapLeft (
            readonlyArray.map (msg => `${message`on index ${i}`}: ${msg}`),
          ),
        )
      }

      out.push (result.success (processResult))
    }

    return result.succeed (out)
  })
