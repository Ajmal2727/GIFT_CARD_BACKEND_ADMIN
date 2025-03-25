import { Router } from "express";
import {getAllOrders, getUserOrders} from "../controllers/orders.controller.js"
export const orderRoute = Router();

orderRoute.route('/get-all-orders').get(getAllOrders)
orderRoute.route('/get-orders/:id').get(getUserOrders)