/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result_ from "../../modules/Result"
import { pipe } from "../../utils/flow"
import { hole } from "../../utils/hole"
import { Schema } from "./schema"
import { invalid } from "./validation"

export interface ResultSchemas<E, A> {
  readonly success: Schema<A>
  readonly failure: Schema<E>
}

export const result: {
  <E, A>(schemas: ResultSchemas<E, A>): Schema<result_.Result<E, A>>
} = schemas => ({
  Type: hole (),
  validate: x => {
    if (!result_.isResult (x)) {
      return invalid ([`value \`${x}\` is not a result`])
    }

    return pipe (
      x,
      result_.match ({
        onSuccess: schemas.success as any,
        onFailure: schemas.failure as any,
      }),
    )
  },
})
