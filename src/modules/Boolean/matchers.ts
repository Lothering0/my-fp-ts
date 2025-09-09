export interface Matchers<A, B = A> {
  readonly onFalse: (e: false) => A
  readonly onTrue: (a: true) => B
}

export const match: {
  <A, B = A>(matchers: Matchers<A, B>): (self: boolean) => A | B
} = matchers => self => self ? matchers.onTrue (true) : matchers.onFalse (false)
