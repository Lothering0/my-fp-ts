import * as show_ from '../../typeclasses/Show'
import * as string from '../String'
import { flow } from '../../utils/flow'
import { Duration } from './duration'
import { toTemplate } from './utils'

export const show: {
  (self: Duration): string
} = flow(toTemplate, string.prepend('make("'), string.append('")'))

export const Show: show_.Show<Duration> = { show }
