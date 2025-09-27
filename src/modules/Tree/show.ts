import * as Array from '../ReadonlyArray'
import * as Iterable from '../Iterable'
import * as Boolean from '../Boolean'
import { Tree } from './tree'
import { Show } from '../../typeclasses/Show'
import { pipe } from '../../utils/flow'
import { forestOf, hasForest, valueOf } from './utils'

export const getShow: {
  <A>(Show: Show<A>): Show<Tree<A>>
} = Show => ({
  show: self =>
    pipe(self, valueOf, Show.show, s =>
      pipe(
        self,
        hasForest,
        Boolean.match({
          onFalse: () => `make(${s})`,
          onTrue: () =>
            `make(${s}, ${pipe(self, forestOf, Iterable.toReadonlyArray, Array.getShow(getShow(Show)).show)})`,
        }),
      ),
    ),
})
