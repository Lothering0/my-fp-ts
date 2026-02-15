import * as Result_ from '../../modules/Result'
import { flow, pipe } from '../../utils/flow'
import { create, Schema } from './schema'
import { message } from './process'

export interface ResultSchemas<A, E> {
  readonly success: Schema<A>
  readonly failure: Schema<E>
}

const ResultFn = <A, E>(
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

export const Result: {
  <A, E>(schemas: ResultSchemas<A, E>): Schema<Result_.Result<A, E>>

  readonly orElse: <B, D>(
    result: Result_.Result<B, D>,
  ) => <In, A>(
    Schema: Schema<In, Result_.Result<A, unknown>>,
  ) => Schema<In, Result_.Result<A | B, D>>

  readonly getOrElse: <E, B>(
    f: (e: E) => B,
  ) => <In, A>(Schema: Schema<In, Result_.Result<A, E>>) => Schema<In, A | B>
} = ResultFn as typeof Result

type WritableResult = {
  -readonly [K in keyof typeof Result]: (typeof Result)[K]
}
;(Result as WritableResult).orElse = result => schema =>
  create(flow(schema.proceed, Result_.map(Result_.orElse(result))))
;(Result as WritableResult).getOrElse = f => schema =>
  create(flow(schema.proceed, Result_.map(Result_.getOrElse(f))))
