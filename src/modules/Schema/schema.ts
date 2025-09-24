import { hole } from "../../utils/hole"
import { isFunction } from "../../utils/typeChecks"
import { ProcessResult } from "./process"

export interface Schema<Out, In = Out> {
  readonly _In: In
  readonly Type: Out
  readonly proceed: (x: unknown) => ProcessResult<Out>
  readonly isOptional: boolean
  readonly schemasByKey?: {}
}

export interface SchemaOptional<Out, In = Out> extends Schema<Out, In> {
  readonly isOptional: true
}

export type Type<A extends Schema<unknown>> = A["Type"]

export const create: {
  <Out, In = Out>(proceed: (x: unknown) => ProcessResult<Out>): Schema<Out, In>
  <Out, In = Out>(
    partialSchema: Partial<Omit<Schema<Out, In>, "Type" | "_In">> &
      Pick<Schema<Out, In>, "proceed">,
  ): Schema<Out, In>
} = partialSchemaOrProceed => {
  if (isFunction (partialSchemaOrProceed)) {
    const proceed = partialSchemaOrProceed
    return {
      _In: hole (),
      Type: hole (),
      isOptional: false,
      proceed,
    }
  }

  return {
    _In: hole (),
    Type: hole (),
    isOptional: false,
    ...partialSchemaOrProceed,
  }
}
