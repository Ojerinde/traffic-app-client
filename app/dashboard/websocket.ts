let ws_socket: WebSocket | null = null;

export const initializeWebSocket = () => {
  if (!ws_socket || ws_socket.readyState === WebSocket.CLOSED) {
    // Create WebSocket connection
    ws_socket = new WebSocket(`${process.env.NEXT_PUBLIC_BACKEND_WS}`);

    ws_socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws_socket.onclose = () => {
      console.log("WebSocket connection closed");
      ws_socket = null;
    };

    ws_socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };
  }

  return ws_socket;
};

export const getWebSocket = () => {
  if (!ws_socket || ws_socket.readyState !== WebSocket.OPEN) {
    console.warn("WebSocket connection not established or is not open");
  }
  return ws_socket;
};
