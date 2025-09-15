import * as equivalence from "../../typeclasses/Equivalence"
import * as identity from "../Identity"
import * as option from "../Option"
import { flow, pipe } from "../../utils/flow"
import { doUntil } from "../../utils/loops"
import { constFalse } from "../../utils/constant"

export const getEquivalence: {
  <A>(
    Equivalence: equivalence.Equivalence<A>,
  ): equivalence.Equivalence<Iterable<A>>
} = Equivalence => ({
  equals: second => first =>
    pipe (
      identity.Do,
      identity.apS ("firstIterator", first[Symbol.iterator] ()),
      identity.apS ("secondIterator", second[Symbol.iterator] ()),
      identity.mapTo ("result", ({ firstIterator, secondIterator }) =>
        doUntil (() =>
          pipe (
            identity.Do,
            identity.apS ("first", firstIterator.next ()),
            identity.apS ("second", secondIterator.next ()),
            identity.mapTo (
              "areBothDone",
              ({ first, second }) =>
                Boolean (first.done) && Boolean (second.done),
            ),
            identity.mapTo (
              "someHasFinished",
              ({ first, second }) =>
                Boolean (first.done) || Boolean (second.done),
            ),
            identity.map (({ first, second, areBothDone, someHasFinished }) => ({
              someHasFinished,
              isEquals:
                // Both are done hence they are the same
                areBothDone ||
                // If only one of them is done then `isEquals` should be `false`
                !someHasFinished &&
                  // Comparing values if both are not done
                  Equivalence.equals (second.value) (first.value),
            })),
          ),
        ) (
          flow (
            option.map (
              ({ someHasFinished, isEquals }) =>
                // Don't iterate if one of them is done or some elements are not equal
                someHasFinished || !isEquals,
            ),
            option.getOrElse (constFalse),
          ),
        ),
      ),
      identity.map (({ result }) =>
        pipe (
          result,
          option.map (({ isEquals }) => isEquals),
          option.getOrElse (constFalse),
        ),
      ),
    ),
})
