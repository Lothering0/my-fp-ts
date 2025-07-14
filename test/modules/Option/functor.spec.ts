import * as O from "../../../src/modules/Option"
import { describeFunctor } from "../../_utils/describeFunctor"

describeFunctor (O, [O.some (1), O.none])
