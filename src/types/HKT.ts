export interface HKT {
  readonly _E?: unknown
  readonly _A?: unknown
  readonly type?: unknown
}

export type Kind<F extends HKT, E, A> = F extends { readonly type: unknown }
  ? (F & { readonly _E: E; readonly _A: A })["type"]
  : {
      readonly _F: F
      readonly _E: () => E
      readonly _A: () => A
    }
