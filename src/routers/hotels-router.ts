import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getHotelsWithRooms, getInfoBookingsRoom } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  .all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getHotelsWithRooms)
  .get("/rooms/:hotelId", getInfoBookingsRoom);

export { hotelsRouter };
