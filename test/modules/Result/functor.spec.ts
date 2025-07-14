import * as R from "../../../src/modules/Result"
import { describeFunctor } from "../../_utils/describeFunctor"

describeFunctor (R, [R.failure ("a"), R.success (1)])
