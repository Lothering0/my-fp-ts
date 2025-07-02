export interface HKT {
  readonly _R?: unknown
  readonly _E?: unknown
  readonly _A?: unknown
  readonly type?: unknown
}

export type Kind<F extends HKT, R, E, A> = F extends { readonly type: unknown }
  ? (F & { readonly _R: R; readonly _E: E; readonly _A: A })["type"]
  : {
      readonly _F: F
      readonly _R: () => R
      readonly _E: () => E
      readonly _A: () => A
    }
