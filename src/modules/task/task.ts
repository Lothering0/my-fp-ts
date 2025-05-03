declare module "../../types/Kind" {
  interface Kind<A> {
    readonly Task: Task<A>
  }
}

export interface Task<A> {
  (): Promise<A>
}

type TaskConstructor = <A>(a: A) => Task<A>
export const task: TaskConstructor = a => () => Promise.resolve (a)

type FromTask = <A>(ma: Task<A>) => Promise<A>
export const fromTask: FromTask = ma => ma ()
