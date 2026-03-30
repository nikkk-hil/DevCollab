import { Router } from "express";


const router = Router();

router.route("/register").post(userRegistraion);
router.route("/login").post(userLogin);


export default router