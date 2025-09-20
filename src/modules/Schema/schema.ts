import { Hkt } from "../../typeclasses/Hkt"
import { ValidationResult } from "./validation"

export interface SchemaHkt extends Hkt {
  readonly type: Schema<this["_in"]>
}

export interface Schema<A> {
  readonly Type: A
  readonly validate: (x: unknown) => ValidationResult
  readonly schemasByKey?: {}
  readonly isOptional?: boolean
}

export interface SchemaOptional<A> extends Schema<A> {
  readonly isOptional: true
}

export type Type<A extends Schema<unknown>> = A["Type"]
