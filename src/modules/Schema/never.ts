import * as Result from '../Result'
import { Schema, create } from './schema'
import { message } from './process'

export const Never: Schema<never> = create(x =>
  Result.fail([message`unexpected value ${x}`]),
)
