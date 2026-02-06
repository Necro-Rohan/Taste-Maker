import express from 'express'
import { register, login, restoreAccount, refresh, logout} from "../controllers/auth.controller.js"


const router = express.Router()

router.post("/register", register)

router.post("/restore", restoreAccount)

router.post("/login", login);

router.post("/refresh", refresh);

router.post("/logout", logout);

export default router;