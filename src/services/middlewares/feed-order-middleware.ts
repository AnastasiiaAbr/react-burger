import { socketMiddleware } from "./socket-middleware";
import { feedOrderActions } from "../slices/feed-order-slice";

export const feedOrderMiddleware = socketMiddleware(feedOrderActions, false);