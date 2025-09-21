import * as option from "../../modules/Option"
import * as readonlyArray from "../ReadonlyArray"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { Schema, SchemaOptional, Type } from "./schema"
import { constValid, invalid } from "./validation"

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

export const tuple = <A extends ReadonlyArray<Schema<unknown>>>(
  ...schemas: A
): Schema<ExtractTupleTypes<A>> => ({
  Type: hole (),
  validate: xs => {
    const isArray = Array.isArray (xs)

    if (!isArray) {
      return invalid ([`value \`${xs}\` is not a tuple`])
    }

    const tupleMinLength = pipe (
      schemas,
      readonlyArray.dropRightWhile (({ isOptional }) => Boolean (isOptional)),
      readonlyArray.length,
    )
    const tupleMaxLength = schemas.length

    if (xs.length < tupleMinLength || xs.length > tupleMaxLength) {
      return invalid ([
        `tuple length must be from ${tupleMinLength} to ${tupleMaxLength}, got ${xs.length}`,
      ])
    }

    const invalidElement = pipe (
      schemas,
      readonlyArray.findMap ((schema, i) => {
        const validationResult = schema.validate (xs[i])

        if (validationResult.isValid) {
          return option.none
        }

        return pipe (
          validationResult.messages,
          readonlyArray.map (message => `on index ${i}: ${message}`),
          invalid,
          option.some,
        )
      }),
    )

    return pipe (invalidElement, option.getOrElse (constValid))
  },
})
