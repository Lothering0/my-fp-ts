export interface TryCatch<A, E> {
  readonly try: () => A
  readonly catch: (e: unknown) => E
}
