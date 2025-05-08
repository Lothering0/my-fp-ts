declare module "../../types/Kind" {
  interface Kind<A> {
    readonly Predicate: Predicate<A>
  }
}

export interface Predicate<A> {
  (a: A): boolean
}
