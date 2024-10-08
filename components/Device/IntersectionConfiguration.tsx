"use client";

import { useEffect, useState } from "react";
import { IntersectionConfigItem } from "@/app/dashboard/devices/[deviceId]/page";
import { useRouter, usePathname } from "next/navigation";
import IntersectionConfigurationItem from "./IntersectionConfigurationItem";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  closePreviewCreatedPatternPhase,
  setManualMode,
} from "@/store/signals/SignalConfigSlice";
import { getWebSocket } from "@/app/dashboard/websocket";
import HttpRequest from "@/store/services/HttpRequest";
import {
  GetItemFromLocalStorage,
  SetItemToLocalStorage,
} from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";

interface DeviceConfigurationProps {
  intersectionConfigItems: IntersectionConfigItem[];
  deviceId: string;
}

const IntersectionConfiguration: React.FC<DeviceConfigurationProps> = ({
  intersectionConfigItems,
  deviceId,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { deviceActiveStateData } = useAppSelector((state) => state.userDevice);

  // State to track the current mode (Auto or Manual)
  const [isAutoMode, setIsAutoMode] = useState(deviceActiveStateData.Auto);

  useEffect(() => {
    setIsAutoMode(deviceActiveStateData.Auto);
  }, [deviceActiveStateData]);

  const handleRequest = async (action: string) => {
    const isPasswordVerified = GetItemFromLocalStorage("isPasswordVerified");

    if (!isPasswordVerified || Date.now() - isPasswordVerified.time > 60000) {
      const password = prompt("Please enter your password to proceed");

      if (!password) return;

      try {
        await HttpRequest.post("/confirm-password", {
          email: GetItemFromLocalStorage("user").email,
          password,
        });
        emitToastMessage("Password verified", "success");
        SetItemToLocalStorage("isPasswordVerified", {
          isPasswordVerified: true,
          time: Date.now(),
        });
      } catch (error: any) {
        emitToastMessage(error?.response.data.message, "error");
        return;
      }
    }
    if (action === "Manual") {
      dispatch(setManualMode(true));
      setIsAutoMode(false);
      dispatch(closePreviewCreatedPatternPhase());
    }
    if (action === "Auto") {
      setIsAutoMode(true);
      dispatch(setManualMode(false));
    }

    const socket = getWebSocket();

    const sendMessage = () => {
      socket.send(
        JSON.stringify({
          event: "intersection_control_request",
          payload: { action: action, DeviceID: deviceId },
        })
      );
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendMessage();
    } else {
      socket.onopen = () => {
        sendMessage();
      };
    }
    // Update the time since one of the button has been clicked again
    SetItemToLocalStorage("isPasswordVerified", {
      isPasswordVerified: true,
      time: Date.now(),
    });

    return () => {
      if (socket) {
        socket.close();
      }
    };
  };

  return (
    <section className="intersectionConfiguration">
      <div className="intersectionConfiguration__header">
        <h2>Intersection Configuration</h2>
        <button
          type="button"
          onClick={() => {
            router.push(`${pathname}/intersection_configuration`);
            dispatch(setManualMode(false));
          }}
        >
          Configure
        </button>
      </div>

      <ul className="intersectionConfiguration__list">
        {intersectionConfigItems.map(
          (item: IntersectionConfigItem, index: any) => (
            <IntersectionConfigurationItem key={index} item={item} />
          )
        )}
      </ul>

      <div>
        <h2>Intersection Commands Control</h2>
        <div className="intersectionConfiguration__commands">
          <button
            onClick={() => {
              const action = isAutoMode ? "Manual" : "Auto";
              handleRequest(action);
            }}
          >
            {isAutoMode ? "Switch to Manual" : "Switch to Auto"}
          </button>
          <button onClick={() => handleRequest("Hold")}>Hold</button>
          <button onClick={() => handleRequest("Next")}>Next</button>
          <button onClick={() => handleRequest("Restart")}>Restart</button>
          <button onClick={() => handleRequest("Power")}>Power</button>
          <button onClick={() => handleRequest("Reset")}>Reset</button>
        </div>
      </div>
    </section>
  );
};

export default IntersectionConfiguration;
