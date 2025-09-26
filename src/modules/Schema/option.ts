import * as option from '../Option'
import * as result from '../Result'
import { flow, pipe } from '../../utils/flow'
import { create, Schema } from './schema'
import { message } from './process'

export const Option = <A>(schema: Schema<A>): Schema<option.Option<A>> =>
  create(x => {
    if (!option.isOption(x)) {
      return result.fail([message`value ${x} is not an option`])
    }

    return pipe(
      x,
      option.match({
        onSome: flow(schema.proceed, result.map(option.some)),
        onNone: () => result.succeed(option.none),
      }),
    )
  })
