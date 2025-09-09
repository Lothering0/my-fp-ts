import * as ord from "../../typeclasses/Ord"

export const Ord: ord.Ord<boolean> = {
  compare: y => x => y === x ? 0 : !x ? -1 : 1,
}
