import * as Result from '../Result'
import { create, Schema } from './schema'

export const Any: Schema<any> = create(Result.succeed)
