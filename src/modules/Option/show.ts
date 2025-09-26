import { Show } from '../../typeclasses/Show'
import { Option } from './option'
import { match } from './matchers'
import { constant } from '../../utils/constant'
import { flow } from '../../utils/flow'

export const getShow: {
  <A>(Show: Show<A>): Show<Option<A>>
} = Show => ({
  show: match({
    onNone: constant('none'),
    onSome: flow(Show.show, x => `some(${x})`),
  }),
})
