import { Predicate } from "../modules/predicate"

type Filter = <A>(ma: Array<A>, f: Predicate<A>) => Array<A>
export const filter: Filter = (ma, f) => ma.filter (f)
