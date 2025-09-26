import { hole } from '../../utils/hole'
import { isFunction } from '../../utils/typeChecks'
import { ProcessResult } from './process'

export interface Schema<In, Out = In> {
  readonly In: In
  readonly Type: Out
  readonly proceed: (x: unknown) => ProcessResult<Out>
  readonly isOptional: boolean
  readonly schemasByKey?: {}
}

export interface SchemaOptional<In, Out = In> extends Schema<In, Out> {
  readonly isOptional: true
}

export type Type<A extends Schema<unknown>> = A['Type']

export const create: {
  <In, Out = In>(proceed: (x: unknown) => ProcessResult<Out>): Schema<In, Out>
  <Out, In = Out>(
    partialSchema: Partial<Omit<Schema<In, Out>, 'Type' | 'In'>> &
      Pick<Schema<In, Out>, 'proceed'>,
  ): Schema<In, Out>
} = partialSchemaOrProceed => {
  if (isFunction(partialSchemaOrProceed)) {
    const proceed = partialSchemaOrProceed
    return {
      In: hole(),
      Type: hole(),
      isOptional: false,
      proceed,
    }
  }

  return {
    In: hole(),
    Type: hole(),
    isOptional: false,
    ...partialSchemaOrProceed,
  }
}
