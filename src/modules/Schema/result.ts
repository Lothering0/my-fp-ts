import * as Result_ from '../../modules/Result'
import { flow, pipe } from '../../utils/flow'
import { create, Schema } from './schema'
import { message } from './process'

export interface ResultSchemas<E, A> {
  readonly success: Schema<A>
  readonly failure: Schema<E>
}

export const Result = <E, A>(
  schemas: ResultSchemas<E, A>,
): Schema<Result_.Result<E, A>> =>
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
          Result_.map<E, Result_.Result<E, A>>(Result_.fail),
        ),
      }),
    )
  })
