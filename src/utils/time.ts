import { io, IO } from "../modules/io"
import { compose } from "../modules/identity"

type Now = () => IO<number>
export const now: Now = compose<void, number, IO<number>> (io, Date.now)
