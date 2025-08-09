export interface Hkt {
  readonly _S?: unknown
  readonly _E?: unknown
  readonly _A?: unknown
  readonly type?: unknown
}

export type Kind<F extends Hkt, S, E, A> = F extends {
  readonly type: unknown
}
  ? (F & {
      readonly _S: S
      readonly _E: E
      readonly _A: A
    })["type"]
  : {
      readonly _F: F
      readonly _S: () => S
      readonly _E: () => E
      readonly _A: () => A
    }
