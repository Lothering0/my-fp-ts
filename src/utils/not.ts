type Not = <T extends boolean>(a: T) => T extends true ? false : true
export const not: Not = <T>(a: T) => !a as T extends true ? false : true
