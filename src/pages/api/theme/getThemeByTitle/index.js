import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import { getThemeByTitle } from "../../../../../backend/controllers/themeController";
import onError from "../../../../../backend/middlewares/errors";

const router = createRouter();
connectMongoDb();
router.get(getThemeByTitle);

export default router.handler({ onError });
