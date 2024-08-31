import { getWebSocket } from "@/app/dashboard/websocket";
import { useState, useEffect } from "react";

interface DeviceStatus {
  id: string;
  status: boolean;
}

export const useDeviceStatus = () => {
  const [statuses, setStatuses] = useState<DeviceStatus[]>([]);

  useEffect(() => {
    const ws = getWebSocket();

    const timeoutMap: { [key: string]: NodeJS.Timeout } = {};

    const updateDeviceStatus = (id: string, status: boolean) => {
      setStatuses((prevStatuses) => {
        const existingStatus = prevStatuses.find((s) => s.id === id);
        if (existingStatus) {
          return prevStatuses.map((s) => (s.id === id ? { ...s, status } : s));
        } else {
          return [...prevStatuses, { id, status }];
        }
      });
    };

    const handleWebSocketMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log("Event received", message);
      if (
        message.event === "ping_received" &&
        message?.source.type === "hardware"
      ) {
        const deviceId = message.source.id;

        // Set the device status to online
        updateDeviceStatus(deviceId, true);

        // Clear the timeout and set a new one to mark the device as offline if no ping is received
        clearTimeout(timeoutMap[deviceId]);
        timeoutMap[deviceId] = setTimeout(() => {
          updateDeviceStatus(deviceId, false);
        }, 12000);
      }
    };

    if (ws) {
      ws.onmessage = handleWebSocketMessage;
    }

    return () => {
      if (ws) {
        ws.close();
      }
      Object.values(timeoutMap).forEach(clearTimeout);
    };
  }, []);

  return statuses;
};
