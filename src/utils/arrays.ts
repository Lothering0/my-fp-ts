import { Predicate } from "../modules/predicate"
import { overloadWithPointFree } from "./points"

interface FilterPointed {
  <A>(ma: Array<A>, f: Predicate<A>): Array<A>
}

interface Filter extends FilterPointed {
  <A>(f: Predicate<A>): (ma: Array<A>) => Array<A>
}

const filterPointed: FilterPointed = (ma, f) => ma.filter (f)

export const filter: Filter = overloadWithPointFree (filterPointed)
