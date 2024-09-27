"use client";

import DeviceConfiguration from "@/components/Device/DeviceConfiguration";
import IntersectionConfiguration from "@/components/Device/IntersectionConfiguration";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { setIsIntersectionConfigurable } from "@/store/signals/SignalConfigSlice";
import { useEffect, useState } from "react";
import { getWebSocket } from "../../websocket";
import { emitToastMessage } from "@/utils/toastFunc";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { getDeviceStatus } from "../page";
import { formatRtcDate, formatRtcTime } from "@/utils/misc";
import { addCurrentDeviceInfoData } from "@/store/devices/UserDeviceSlice";

interface DeviceDetailsProps {
  params: any;
}
export interface DeviceConfigItem {
  iconName: string;
  label: string;
  value: string;
}
export interface IntersectionConfigItem {
  label: string;
  value: string;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ params }) => {
  const dispatch = useAppDispatch();
  getWebSocket();
  const statuses = useDeviceStatus();

  const deviceId = params.deviceId;
  const icon = getDeviceStatus(statuses, deviceId) ? "ON" : "OFF";
  console.log(deviceId, statuses, icon);

  const { isIntersectionConfigurable } = useAppSelector(
    (state) => state.signalConfig
  );
  const { currentDeviceInfoData } = useAppSelector((state) => state.userDevice);

  useEffect(() => {
    dispatch(setIsIntersectionConfigurable(false));
  }, [dispatch, isIntersectionConfigurable]);

  useEffect(() => {
    const socket = getWebSocket();

    // function to handle info data feedback
    const handleDataFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);

      if (feedback.event === "info_feedback") {
        if (feedback.payload.error) {
          dispatch(
            addCurrentDeviceInfoData({
              Bat: "",
              Temp: "",
              Rtc: "",
              Id: "",
            })
          );
          emitToastMessage("Could not fetch device info   data", "error");
        } else {
          dispatch(addCurrentDeviceInfoData(feedback.payload));
          emitToastMessage("Device Info data fetched succesfully", "success");
        }
      }
    };

    socket?.addEventListener("message", handleDataFeedback);

    return () => {
      socket?.removeEventListener("message", handleDataFeedback);
    };
  }, []);

  const deviceConfigItems: DeviceConfigItem[] = [
    {
      iconName: "calendar",
      label: "Date",
      value: formatRtcDate(currentDeviceInfoData?.Rtc),
    },
    {
      iconName: "clock",
      label: "Time",
      value: formatRtcTime(currentDeviceInfoData?.Rtc),
    },
    {
      iconName: "temp",
      label: "Enclosed Temp.",
      value: currentDeviceInfoData?.Temp || "Fetching",
    },
    {
      iconName: "battery-charging",
      label: "Battery Status",
      value: `${currentDeviceInfoData?.Bat || "Fetching"}`,
    },
    {
      iconName: "wifi",
      label: "WiFi Status",
      value: icon,
    },
  ];

  const intersectionConfigItems: IntersectionConfigItem[] = [
    {
      label: "Intersection Name or ID",
      value: currentDeviceInfoData?.Id,
    },
    {
      label: "Active Plan",
      value: "Weekday",
    },
    {
      label: "Selected Command",
      value: "Auto",
    },
  ];

  return (
    <section className="device">
      <div className="device__left">
        <FourWayIntersection editable={isIntersectionConfigurable} />
      </div>
      <div className="device__right">
        <div className="device__right--top">
          <DeviceConfiguration deviceConfigItems={deviceConfigItems} />
        </div>
        <div className="device__right--bottom">
          <IntersectionConfiguration
            intersectionConfigItems={intersectionConfigItems}
          />
        </div>
      </div>
    </section>
  );
};

export default DeviceDetails;
