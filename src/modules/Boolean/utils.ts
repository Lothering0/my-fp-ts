export const not: {
  <A extends boolean>(a: A): A extends true ? false : true
} = <A>(a: A) => !a as A extends true ? false : true

export const or: {
  (a: boolean): (self: boolean) => boolean
} = a => self => a || self

export const and: {
  (a: boolean): (self: boolean) => boolean
} = a => self => a && self
