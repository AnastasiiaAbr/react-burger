import { socketMiddleware } from "./socket-middleware";
import { profileOrderActions } from "../slices/profile-orders-slice";

export const profileOrdersMiddleware = socketMiddleware(profileOrderActions, true);

