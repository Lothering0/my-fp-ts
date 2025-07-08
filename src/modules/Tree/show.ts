import * as A from "../Array"
import { Tree } from "./tree"
import { Show } from "../../types/Show"
import { pipe } from "../../utils/flow"
import { forestOf, hasForest, valueOf } from "./utils"

export const getShow: {
  <A>(S: Show<A>): Show<Tree<A>>
} = S => ({
  show: self =>
    pipe (self, valueOf, S.show, s =>
      hasForest (self)
        ? `make (${s}, ${pipe (self, forestOf, A.getShow (getShow (S)).show)})`
        : `make (${s})`,
    ),
})
