export interface Hkt {
  readonly In?: unknown
  readonly Collectable?: unknown
  readonly Fixed?: unknown
  readonly Type?: unknown
}

export type Kind<
  F extends Hkt,
  In = never,
  Collectable = never,
  Fixed = never,
> = F extends {
  readonly Type: unknown
}
  ? (F & {
      readonly In: In
      readonly Collectable: Collectable
      readonly Fixed: Fixed
    })['Type']
  : {
      readonly _F: F
      readonly In: () => In
      readonly Collectable: () => Collectable
      readonly Fixed: () => Fixed
    }
