declare module "../../types/Kind" {
  export interface Kind<A> {
    readonly Predicate: Predicate<A>
  }
}

export interface Predicate<A> {
  (a: A): boolean
}
