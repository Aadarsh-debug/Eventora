import express from "express"
import {protect,admin} from "../middlewares/auth.js"
import {getAllEvent,getEventById,createEvent,updateEvent,deleteEvent} from "../controllers/event.controller.js"

const router =express.Router();

router.get("/",getAllEvent);
router.get("/:id",getEventById);

 // only admin can do 

router.post("/",protect,admin,createEvent);
router.put("/:id",protect,admin,updateEvent);
router.delete("/:id",protect,admin,deleteEvent);
export default router
