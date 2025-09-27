import * as Equivalence from '../../typeclasses/Equivalence'

export const getEquivalence: {
  <A>(
    Equivalence: Equivalence.Equivalence<A>,
  ): Equivalence.Equivalence<Iterable<A>>
} = Equivalence => ({
  equals: second => first => {
    const firstIterator = first[Symbol.iterator]()
    const secondIterator = second[Symbol.iterator]()

    while (true) {
      const x = firstIterator.next()
      const y = secondIterator.next()
      const areBothDone = Boolean(x.done) && Boolean(y.done)
      const someHasDone = Boolean(x.done) || Boolean(y.done)

      if (areBothDone) {
        return true
      }

      if (someHasDone) {
        return false
      }

      const isEquals = Equivalence.equals(y.value)(x.value)
      if (!isEquals) {
        return false
      }
    }
  },
})
