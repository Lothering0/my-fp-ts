import * as Show_ from '../../typeclasses/Show'
import * as String from '../String'
import { flow } from '../../utils/flow'
import { Duration } from './duration'
import { toTemplate } from './utils'

export const show: {
  (duration: Duration): string
} = flow(toTemplate, String.prepend('make("'), String.append('")'))

export const Show: Show_.Show<Duration> = { show }
