import { compose } from "src/utils"
import { io, IO } from "../io"

type Now = () => IO<number>
export const now: Now = compose<void, number, IO<number>> (io, Date.now)
