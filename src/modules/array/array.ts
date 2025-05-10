declare module "../../types/Kind" {
  interface Kind<A> {
    readonly Array: Array<A>
  }
}

export interface NonEmptyArray<A> extends Array<A> {
  0: A
}

type Prepend = <A>(a: A) => (as: A[]) => NonEmptyArray<A>
export const prepend: Prepend = a => as => [a, ...as]

type Append = <A>(a: A) => (as: A[]) => NonEmptyArray<A>
export const append: Append =
  <A>(a: A) =>
  as =>
    [...as, a] as unknown as NonEmptyArray<A>
