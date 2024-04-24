import { createRouter } from "next-connect";
import connectMongoDb from "../../../../../backend/config/dbConnect";
import onError from "../../../../../backend/middlewares/errors";
import { authOptions } from "../../../../../backend/controllers/user";
import NextAuth from "next-auth/next";

const router = createRouter();
connectMongoDb();
router.get(NextAuth(authOptions));
router.post(NextAuth(authOptions));

export default router.handler({ onError });
