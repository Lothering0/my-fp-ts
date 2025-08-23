export interface Hkt {
  readonly _in?: unknown
  readonly _collectable?: unknown
  readonly _fixed?: unknown
  readonly type?: unknown
}

export type Kind<
  F extends Hkt,
  In = never,
  Collectable = never,
  Fixed = never,
> = F extends {
  readonly type: unknown
}
  ? (F & {
      readonly _in: In
      readonly _collectable: Collectable
      readonly _fixed: Fixed
    })["type"]
  : {
      readonly _F: F
      readonly _in: () => In
      readonly _collectable: () => Collectable
      readonly _fixed: () => Fixed
    }
