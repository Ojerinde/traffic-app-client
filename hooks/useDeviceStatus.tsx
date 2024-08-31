"use client";
import { useState, useEffect } from "react";
import { initializeWebSocket } from "@/app/dashboard/websocket";

interface Message {
  event: string;
  source: string;
  timestamp: string;
}

export const useDeviceStatus = () => {
  const [status, setStatus] = useState<boolean>(false);

  useEffect(() => {
    const ws = initializeWebSocket();
    let pingTimeout: NodeJS.Timeout;

    const handleWebSocketMessage = (event: MessageEvent) => {
      const message: Message = JSON.parse(event.data);

      if (message.event === "ping_received" && message.source === "hardware") {
        console.log("Ping received from hardware at:", message.timestamp);
        setStatus(true);

        clearTimeout(pingTimeout);

        pingTimeout = setTimeout(() => {
          setStatus(false);
          console.log("No ping received, status set to false");
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
      clearTimeout(pingTimeout);
    };
  }, []);

  return status;
};
