import * as Option_ from '../Option'
import * as Result from '../Result'
import { flow, pipe } from '../../utils/flow'
import { create, Schema } from './schema'
import { message } from './process'

export const Option = <A>(schema: Schema<A>): Schema<Option_.Option<A>> =>
  create(x => {
    if (!Option_.isOption(x)) {
      return Result.fail([message`value ${x} is not an option`])
    }

    return pipe(
      x,
      Option_.match({
        onSome: flow(schema.proceed, Result.map(Option_.some)),
        onNone: () => Result.succeed(Option_.none),
      }),
    )
  })
