import * as eq from "../../typeclasses/Eq"

export const getEq: {
  <A>(Eq: eq.Eq<A>): eq.Eq<Iterable<A>>
} = Eq => ({
  equals: ys => xs => {
    for (const x of xs) {
      for (const y of ys) {
        if (!Eq.equals (y) (x)) {
          return false
        }
      }
    }
    return true
  },
})
