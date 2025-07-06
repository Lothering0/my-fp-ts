import { AsyncOption, fromAsyncOption } from "./async-option"
import { Semigroup } from "../../types/Semigroup"

export const getRaceSemigroup: {
  <A>(): Semigroup<AsyncOption<A>>
} = () => ({
  concat: (x, y) => () =>
    Promise.race ([fromAsyncOption (x), fromAsyncOption (y)]),
})
