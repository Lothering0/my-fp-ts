export interface Matchers<A, B = A> {
  readonly onFalse: (e: false) => A
  readonly onTrue: (a: true) => B
}

export const match: {
  <A, B = A>(matchers: Matchers<A, B>): (boolean: boolean) => A | B
} = matchers => boolean =>
  boolean ? matchers.onTrue(true) : matchers.onFalse(false)
