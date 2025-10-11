export interface Tagged<A extends string = string> {
  readonly _tag: A
}

export type Tag<A extends Tagged> = A['_tag']
