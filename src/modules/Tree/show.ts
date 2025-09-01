import * as readonlyArray from "../ReadonlyArray"
import * as boolean from "../Boolean"
import { Tree } from "./tree"
import { Show } from "../../typeclasses/Show"
import { pipe } from "../../utils/flow"
import { forest, hasForest, value } from "./utils"

export const getShow: {
  <A>(Show: Show<A>): Show<Tree<A>>
} = Show => ({
  show: self =>
    pipe (self, value, Show.show, s =>
      pipe (
        self,
        hasForest,
        boolean.match (
          () => `make (${s})`,
          () =>
            `make (${s}, ${pipe (self, forest, readonlyArray.getShow (getShow (Show)).show)})`,
        ),
      ),
    ),
})
