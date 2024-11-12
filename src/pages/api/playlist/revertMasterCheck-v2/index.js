import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { revertMasterCheckV2 } from "../../../../../backend/controllers/playlistController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(revertMasterCheckV2);
export default router.handler({ onError });
