import { hole } from "../../utils/hole"
import { isFunction } from "../../utils/typeChecks"
import { ProcessResult } from "./process"

export interface Schema<A> {
  readonly Type: A
  readonly proceed: (x: unknown) => ProcessResult<A>
  readonly isOptional: boolean
  readonly schemasByKey?: {}
}

export interface SchemaOptional<A> extends Schema<A> {
  readonly isOptional: true
}

export type Type<A extends Schema<unknown>> = A["Type"]

export const create: {
  <A>(proceed: (x: unknown) => ProcessResult<A>): Schema<A>
  <A>(
    partialSchema: Partial<Omit<Schema<A>, "Type">> &
      Pick<Schema<A>, "proceed">,
  ): Schema<A>
} = partialSchemaOrProceed => {
  if (isFunction (partialSchemaOrProceed)) {
    const proceed = partialSchemaOrProceed
    return {
      Type: hole (),
      isOptional: false,
      proceed,
    }
  }

  return {
    Type: hole (),
    isOptional: false,
    ...partialSchemaOrProceed,
  }
}
