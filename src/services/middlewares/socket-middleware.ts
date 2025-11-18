import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Middleware,
} from "@reduxjs/toolkit";
import { RootState } from "../root-reducer";
import { refreshToken } from "../../utils/token-helpers";

export type WsActions<R, S> = {
  wsConnect: ActionCreatorWithPayload<string>;
  wsDisconnect: ActionCreatorWithoutPayload;
  onConnecting?: ActionCreatorWithoutPayload;
  onClose?: ActionCreatorWithoutPayload;
  onOpen?: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<R>;
  sendMessage?: ActionCreatorWithPayload<S>;
};

const RECONNECT_PERIOD = 5000;

export const socketMiddleware = <A, B>(
  wsActions: WsActions<A, B>,
  withTokenRefresh = false
): Middleware<Record<string, never>, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    const {
      wsConnect,
      wsDisconnect,
      onConnecting,
      onClose,
      onOpen,
      onError,
      onMessage,
      sendMessage,
    } = wsActions;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let isConnected = false;
    let url = "";
    const { dispatch } = store;

    return (next) => (action: unknown) => {
      if (wsConnect.match(action)) {
        url = action.payload;

        onConnecting && dispatch(onConnecting());

        try {
          socket = new WebSocket(url);
        } catch {
          dispatch(onError('WebSocket не может подключиться'));
          return;
        }
        isConnected = true;

        socket.onopen = () => {
          onOpen && dispatch(onOpen());
        };
        socket.onclose = (event) => {
          onClose && dispatch(onClose());

          if (isConnected && event.code !== 1000) {
            reconnectTimer = setTimeout(() => {
              dispatch(wsConnect(url));
            }, RECONNECT_PERIOD);
          }
        };
        socket.onerror = () => {
          if (process.env.NODE_ENV === 'production') {
            dispatch(onError("WebSocket ошибка"));
          }
        };
        socket.onmessage = async (event) => {
          try {
            const parsedData: A = JSON.parse(event.data);

            if (withTokenRefresh && (parsedData as any).message === "Invalid or missing token") {
              await refreshToken()
                .then(refreshedData => {
                  const wssUrl = new URL(url);
                  wssUrl.searchParams.set("token", refreshedData.accessToken.replace("Bearer ", ""));
                  dispatch(wsConnect(wssUrl.toString()));
                })
                .catch((error) => {
                  dispatch(onError((error as Error).message));
                });

              dispatch(wsDisconnect());
              return;
            }

            dispatch(onMessage(parsedData));
          } catch (err) {
            dispatch(onError((err as Error).message));
          }
        };

        return;
      }

      if (socket && wsDisconnect.match(action)) {
        reconnectTimer && clearTimeout(reconnectTimer);
        isConnected = false;
        reconnectTimer = null;
        socket.close();
        socket = null;
        return;
      }

      if (socket && sendMessage?.match(action)) {
        const { payload } = action;

        try {
          socket.send(JSON.stringify(payload));
        } catch (err) {
          dispatch(onError((err as Error).message));
        }
        return;
      }

      return next(action);
    };
  };
};
