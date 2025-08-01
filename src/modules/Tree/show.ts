import * as readonlyArray from "../ReadonlyArray"
import * as boolean from "../Boolean"
import { Tree } from "./tree"
import { Show } from "../../types/Show"
import { pipe } from "../../utils/flow"
import { forest, hasForest, value } from "./utils"

export const getShow: {
  <A>(S: Show<A>): Show<Tree<A>>
} = S => ({
  show: self =>
    pipe (self, value, S.show, s =>
      pipe (
        self,
        hasForest,
        boolean.match (
          () => `make (${s})`,
          () =>
            `make (${s}, ${pipe (self, forest, readonlyArray.getShow (getShow (S)).show)})`,
        ),
      ),
    ),
})
