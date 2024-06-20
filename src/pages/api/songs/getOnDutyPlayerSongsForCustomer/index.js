import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getOnDutyPlayerSongsForCustomer } from "../../../../../backend/controllers/songsController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getOnDutyPlayerSongsForCustomer);

export default router.handler({
  onError,
});
