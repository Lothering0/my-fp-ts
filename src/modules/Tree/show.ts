import * as readonlyArray from "../ReadonlyArray"
import * as iterable from "../Iterable"
import * as boolean from "../Boolean"
import { Tree } from "./tree"
import { Show } from "../../typeclasses/Show"
import { pipe } from "../../utils/flow"
import { forestOf, hasForest, valueOf } from "./utils"

export const getShow: {
  <A>(Show: Show<A>): Show<Tree<A>>
} = Show => ({
  show: self =>
    pipe (self, valueOf, Show.show, s =>
      pipe (
        self,
        hasForest,
        boolean.match ({
          onFalse: () => `make (${s})`,
          onTrue: () =>
            `make (${s}, ${pipe (self, forestOf, iterable.toReadonlyArray, readonlyArray.getShow (getShow (Show)).show)})`,
        }),
      ),
    ),
})
