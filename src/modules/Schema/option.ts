import * as Option_ from '../Option'
import * as Result from '../Result'
import { flow, pipe } from '../../utils/flow'
import { create, Schema } from './schema'
import { message } from './process'

const OptionFn: {
  <A>(schema: Schema<A>): Schema<Option_.Option<A>>
} = schema =>
  create(x => {
    if (!Option_.isOption(x)) {
      return Result.fail([message`value ${x} is not an option`])
    }

    return pipe(
      x,
      Option_.match({
        onSome: flow(schema.proceed, Result.map(Option_.some)),
        onNone: () => Result.succeed(Option_.none()),
      }),
    )
  })

export const Option: {
  <A>(schema: Schema<A>): Schema<Option_.Option<A>>

  readonly orElse: <B>(
    mb: Option_.Option<B>,
  ) => <In, A>(
    Schema: Schema<In, Option_.Option<A>>,
  ) => Schema<In, Option_.Option<A | B>>

  readonly getOrElse: <B>(
    f: () => B,
  ) => <In, A>(Schema: Schema<In, Option_.Option<A>>) => Schema<In, A | B>
} = OptionFn as typeof Option

type WritableOption = {
  -readonly [K in keyof typeof Option]: (typeof Option)[K]
}
;(Option as WritableOption).orElse = mb => schema =>
  create(flow(schema.proceed, Result.map(Option_.orElse(mb))))
;(Option as WritableOption).getOrElse = f => schema =>
  create(flow(schema.proceed, Result.map(Option_.getOrElse(f))))
