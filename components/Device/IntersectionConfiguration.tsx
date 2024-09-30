"use client";

import { IntersectionConfigItem } from "@/app/dashboard/devices/[deviceId]/page";
import { useRouter, usePathname } from "next/navigation";
import IntersectionConfigurationItem from "./IntersectionConfigurationItem";
import { useAppDispatch } from "@/hooks/reduxHook";
import { setManualMode } from "@/store/signals/SignalConfigSlice";
import { getWebSocket } from "@/app/dashboard/websocket";

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

  const handleRequest = (action: string, additionalData: any = {}) => {
    console.log(`Action: ${action}`, additionalData);
    if (action === "manual") {
      dispatch(setManualMode(true));
      return;
    }
    const socket = getWebSocket();
    socket.send(
      JSON.stringify({
        event: "intersection_control_request",
        payload: { action: action, deviceId, ...additionalData },
      })
    );
  };

  return (
    <section className="intersectionConfiguration">
      <div className="intersectionConfiguration__header">
        <h2>Intersection Configuration</h2>
        <button
          type="button"
          onClick={() => {
            router.push(`${pathname}/intersection_configuration`);
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
          <button onClick={() => handleRequest("auto")}>Auto</button>
          <button onClick={() => handleRequest("manual")}>Manual</button>
          <button onClick={() => handleRequest("hold")}>Hold</button>
          <button onClick={() => handleRequest("next")}>Next</button>
          <button onClick={() => handleRequest("restart")}>Restart</button>
          <button onClick={() => handleRequest("power")}>Power</button>
          <button onClick={() => handleRequest("reset")}>Reset</button>
        </div>
      </div>
    </section>
  );
};

export default IntersectionConfiguration;
