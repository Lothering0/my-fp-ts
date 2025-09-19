import * as option from "../../modules/Option"
import * as string from "../../modules/String"
import * as readonlyArray from "../ReadonlyArray"
import * as readonlyRecord from "../ReadonlyRecord"
import { Schema, SchemaOptional, Type } from "./schema"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { isRecord } from "../../utils/typeChecks"
import { constValid, invalid } from "./validation"

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
      return invalid ([`value ${x} is not a struct`])
    }

    const DifferenceMagma = readonlyArray.getDifferenceMagma (string.Equivalence)
    const excessiveKeys = pipe (
      x,
      readonlyRecord.keys,
      DifferenceMagma.combine (pipe (schemasByKey, readonlyRecord.keys)),
    )

    if (readonlyArray.isNonEmpty (excessiveKeys)) {
      return invalid (
        pipe (
          excessiveKeys,
          readonlyArray.map (key => `key ${key} should not exist`),
        ),
      )
    }

    const missingKeys = pipe (
      schemasByKey,
      readonlyRecord.keys,
      readonlyArray.filter (
        k => !(schemasByKey[k] as SchemaOptional<unknown>)?.isOptional,
      ),
      DifferenceMagma.combine (pipe (x, readonlyRecord.keys)),
    )

    if (readonlyArray.isNonEmpty (missingKeys)) {
      return invalid (
        pipe (
          missingKeys,
          readonlyArray.map (key => `key ${key} is required`),
        ),
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
          readonlyArray.map (message => `on property ${k}: ${message}`),
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
