import { getEmpleadoDashboardStats } from "../controllers/empleadoController";
import express from "express";

const router = express.Router();

router.get('/dashboard', (req: express.Request, res: express.Response)=>{
  getEmpleadoDashboardStats(req,res);
});

export default router;
