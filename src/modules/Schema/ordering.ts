import * as Ordering_ from '../Ordering'
import { pipe } from '../../utils/flow'
import { Schema } from './schema'
import { exact, union } from './utils'

export const Ordering: Schema<Ordering_.Ordering> = pipe(
  exact(-1),
  union(exact(0)),
  union(exact(1)),
)
