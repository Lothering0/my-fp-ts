import {
  FunctorWithIndex,
  createFunctorWithIndex,
} from "../../types/FunctorWithIndex"

export const functor: FunctorWithIndex<"Array"> = createFunctorWithIndex ({
  _URI: "Array",
  pure: a => [a],
  map: (fa, f) => fa.map (f),
})

export const { pure, map } = functor
