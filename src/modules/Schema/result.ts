/* eslint-disable @typescript-eslint/no-explicit-any */
import * as result_ from "../../modules/Result"
import { pipe } from "../../utils/flow"
import { create, Schema } from "./schema"
import { invalid, message } from "./validation"

export interface ResultSchemas<E, A> {
  readonly success: Schema<A>
  readonly failure: Schema<E>
}

export const Result: {
  <E, A>(schemas: ResultSchemas<E, A>): Schema<result_.Result<E, A>>
} = schemas =>
  create (x => {
    if (!result_.isResult (x)) {
      return invalid ([message`value ${x} is not a result`])
    }

    return pipe (
      x,
      result_.match ({
        onSuccess: schemas.success as any,
        onFailure: schemas.failure as any,
      }),
    )
  })
