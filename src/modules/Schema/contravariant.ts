import * as contravariant from "../../typeclasses/Contravariant"
import { flow } from "../../utils/flow"
import { create, SchemaHkt } from "./schema"

export const Contravariant: contravariant.Contravariant<SchemaHkt> = {
  contramap: f => schema => create (flow (f, schema.validate)),
}

export const { contramap } = Contravariant
