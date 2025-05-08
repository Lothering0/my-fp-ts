declare module "../../types/Kind" {
  interface Kind<A> {
    readonly Array: Array<A>
  }
}

export * from "./functor"
export * from "./applicative"
export * from "./monad"
export * from "./semigroup"
export * from "./monoid"
