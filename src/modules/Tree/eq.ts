import * as readonlyArray from "../ReadonlyArray"
import { Tree } from "./tree"
import { Eq } from "../../types/Eq"
import { forestOf, valueOf } from "./utils"

export const getEq: {
  <A>(Eq: Eq<A>): Eq<Tree<A>>
} = Eq => ({
  equals: mx => my =>
    Eq.equals (valueOf (mx)) (valueOf (my)) &&
    readonlyArray.getEq (getEq (Eq)).equals (forestOf (mx)) (forestOf (my)),
})
