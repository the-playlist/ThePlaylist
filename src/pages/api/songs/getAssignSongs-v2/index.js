import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getOnDutyAssignSongsV2 } from "../../../../../backend/controllers/songsController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getOnDutyAssignSongsV2);

export default router.handler({
  onError,
});
