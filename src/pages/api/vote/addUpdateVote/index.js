import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { addUpdateVote } from "../../../../../backend/controllers/voteController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.post(addUpdateVote);

export default router.handler({ onError });
