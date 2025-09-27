import * as Result_ from '../../modules/Result'
import { flow, pipe } from '../../utils/flow'
import { create, Schema } from './schema'
import { message } from './process'

export interface ResultSchemas<A, E> {
  readonly success: Schema<A>
  readonly failure: Schema<E>
}

export const Result = <A, E>(
  schemas: ResultSchemas<A, E>,
): Schema<Result_.Result<A, E>> =>
  create(x => {
    if (!Result_.isResult(x)) {
      return Result_.fail([message`value ${x} is not a result`])
    }

    return pipe(
      x,
      Result_.match({
        onSuccess: flow(schemas.success.proceed, Result_.map(Result_.succeed)),
        onFailure: flow(
          schemas.failure.proceed,
          Result_.map<E, Result_.Result<A, E>>(Result_.fail),
        ),
      }),
    )
  })
