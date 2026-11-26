"use client";

import { useEffect, useRef } from "react";
import {
  disconnectNotificationSocket,
  getNotificationSocket,
  NOTIFICATION_NEW_EVENT,
  type NotificationNewEvent,
} from "@/lib/notification-socket";
import { apiRequest, type NotificationItem } from "@/lib/api";

export function useNotificationSocket(options: {
  enabled: boolean;
  onEvent?: (event: NotificationNewEvent) => void;
  onReconnectSync?: (items: NotificationItem[]) => void;
}) {
  const onEventRef = useRef(options.onEvent);
  const onReconnectSyncRef = useRef(options.onReconnectSync);

  useEffect(() => {
    onEventRef.current = options.onEvent;
    onReconnectSyncRef.current = options.onReconnectSync;
  }, [options.onEvent, options.onReconnectSync]);

  useEffect(() => {
    if (!options.enabled) {
      disconnectNotificationSocket();
      return;
    }

    let cancelled = false;
    let socket;
    try {
      socket = getNotificationSocket();
    } catch {
      return;
    }

    const onNew = (payload: NotificationNewEvent) => {
      if (!cancelled) onEventRef.current?.(payload);
    };

    const syncMissed = async () => {
      if (cancelled || !onReconnectSyncRef.current) return;
      try {
        const result = await apiRequest<NotificationItem[]>("/notifications?page=1&pageSize=25");
        if (!cancelled) onReconnectSyncRef.current(result.data);
      } catch {
        // REST remains authoritative; socket is best-effort realtime.
      }
    };

    socket.on(NOTIFICATION_NEW_EVENT, onNew);
    socket.on("connect", () => {
      void syncMissed();
    });
    if (!socket.connected) socket.connect();
    else void syncMissed();

    return () => {
      cancelled = true;
      socket.off(NOTIFICATION_NEW_EVENT, onNew);
      socket.off("connect");
    };
  }, [options.enabled]);
}
