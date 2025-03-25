import {Router} from "express";
import { deleteNotifications, getANotificationsByUserId } from "../controllers/notification.controller.js";

export const notificationRoute = Router()

notificationRoute.route("/get-noti-by-id/:id").get(getANotificationsByUserId)
notificationRoute.route("/delete/:id").delete(deleteNotifications);