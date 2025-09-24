import * as equivalence from "../../typeclasses/Equivalence"

export const getEquivalence: {
  <A>(
    Equivalence: equivalence.Equivalence<A>,
  ): equivalence.Equivalence<Iterable<A>>
} = Equivalence => ({
  equals: second => first => {
    const firstIterator = first[Symbol.iterator] ()
    const secondIterator = second[Symbol.iterator] ()

    while (true) {
      const x = firstIterator.next ()
      const y = secondIterator.next ()
      const areBothDone = Boolean (x.done) && Boolean (y.done)
      const someHasFinished = Boolean (x.done) || Boolean (y.done)

      if (areBothDone) {
        return true
      }

      if (someHasFinished) {
        return false
      }

      const isEquals = Equivalence.equals (y.value) (x.value)
      if (!isEquals) {
        return false
      }
    }
  },
})
