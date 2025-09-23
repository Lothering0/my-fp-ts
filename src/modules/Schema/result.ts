import * as result from "../../modules/Result"
import { flow, pipe } from "../../utils/flow"
import { create, Schema } from "./schema"
import { message } from "./validation"

export interface ResultSchemas<E, A> {
  readonly success: Schema<A>
  readonly failure: Schema<E>
}

export const Result = <E, A>(
  schemas: ResultSchemas<E, A>,
): Schema<result.Result<E, A>> =>
  create (x => {
    if (!result.isResult (x)) {
      return result.fail ([message`value ${x} is not a result`])
    }

    return pipe (
      x,
      result.match ({
        onSuccess: flow (schemas.success.validate, result.map (result.succeed)),
        onFailure: flow (
          schemas.failure.validate,
          result.map<E, result.Result<E, A>> (result.fail),
        ),
      }),
    )
  })
