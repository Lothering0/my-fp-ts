import * as ord from "../../typeclasses/Ord"

export const Ord: ord.Ord<number> = {
  compare: y => x => x === y ? 0 : x > y ? 1 : -1,
}

export const { compare } = Ord
