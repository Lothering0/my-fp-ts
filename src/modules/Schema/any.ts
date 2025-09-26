import * as result from '../Result'
import { create, Schema } from './schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Any: Schema<any> = create(result.succeed)
