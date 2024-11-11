import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { addUpdateVoteV2 } from "../../../../../backend/controllers/voteController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(addUpdateVoteV2);

export default router.handler({ onError });
