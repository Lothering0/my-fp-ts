import * as contravariant from "../../typeclasses/Contravariant"
import { flow } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { SchemaHkt } from "./schema"

export const Contravariant: contravariant.Contravariant<SchemaHkt> = {
  contramap: f => schema => ({
    Type: hole (),
    validate: flow (f, schema.validate),
  }),
}

export const { contramap } = Contravariant
