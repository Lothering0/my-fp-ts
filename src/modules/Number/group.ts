import { Group } from "../../types/Group"
import { MonoidProduct, MonoidSum } from "./monoid"

export const GroupSum: Group<number> = {
  ...MonoidSum,
  inverse: x => -x,
}

export const GroupProduct: Group<number> = {
  ...MonoidProduct,
  inverse: x => 1 / x,
}
