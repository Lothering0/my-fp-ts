import { hole } from "../../utils/hole"
import { isFunction } from "../../utils/typeChecks"
import { ValidationResult } from "./validation"

export interface Schema<A> {
  readonly Type: A
  readonly validate: (x: unknown) => ValidationResult<A>
  readonly isOptional: boolean
  readonly schemasByKey?: {}
}

export interface SchemaOptional<A> extends Schema<A> {
  readonly isOptional: true
}

export type Type<A extends Schema<unknown>> = A["Type"]

export const create: {
  <A>(validate: (x: unknown) => ValidationResult<A>): Schema<A>
  <A>(
    partialSchema: Partial<Omit<Schema<A>, "Type">> &
      Pick<Schema<A>, "validate">,
  ): Schema<A>
} = partialSchemaOrValidate => {
  if (isFunction (partialSchemaOrValidate)) {
    const validate = partialSchemaOrValidate
    return {
      Type: hole (),
      isOptional: false,
      validate,
    }
  }

  return {
    Type: hole (),
    isOptional: false,
    ...partialSchemaOrValidate,
  }
}
