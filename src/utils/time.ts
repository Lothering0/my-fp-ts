import { Io } from "../modules/Io"

export const now: Io<number> = () => Date.now ()
