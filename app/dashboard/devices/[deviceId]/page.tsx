"use client";

import DeviceConfiguration from "@/components/Device/DeviceConfiguration";
import IntersectionConfiguration from "@/components/Device/IntersectionConfiguration";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  previewCreatedPatternPhase,
  setIsIntersectionConfigurable,
  setSignalState,
} from "@/store/signals/SignalConfigSlice";
import { useEffect, useState } from "react";
import { getWebSocket } from "../../websocket";
import { emitToastMessage } from "@/utils/toastFunc";
import { useDeviceStatus } from "@/hooks/useDeviceStatus";
import { formatRtcDate, formatRtcTime, getDeviceStatus } from "@/utils/misc";
import {
  addCurrentDeviceInfoData,
  addCurrentDeviceSignalData,
} from "@/store/devices/UserDeviceSlice";

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

  useEffect(() => {
    getWebSocket();
  }, []);

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
      console.log("Feedback", feedback);

      if (feedback.event === "info_feedback") {
        if (feedback.payload.error) {
          dispatch(
            addCurrentDeviceInfoData({
              Bat: "",
              Temp: "",
              Rtc: "",
              JunctionId: "",
            })
          );
          emitToastMessage("Could not fetch device info data", "error");
        } else {
          dispatch(addCurrentDeviceInfoData(feedback.payload));
          // emitToastMessage("Device Info data fetched succesfully", "success");
        }
      }
      if (feedback.event === "sign_feedback") {
        if (feedback.payload.error) {
          dispatch(
            addCurrentDeviceSignalData({
              Countdown: "",
              Phase: "",
            })
          );
          emitToastMessage("Could not fetch device signal data", "error");
        } else {
          console.log("Phase Feedback", feedback.payload);
          dispatch(
            previewCreatedPatternPhase({
              duration: feedback.payload.Countdown,
              signalString: feedback.payload.Phase,
            })
          );
          dispatch(setSignalState());
          dispatch(addCurrentDeviceSignalData(feedback.payload));
          // emitToastMessage("Device signal data fetched succesfully", "success");
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
      label: "Enclosure Temp.",
      value: currentDeviceInfoData?.Temp || "Nill",
    },
    {
      iconName: "battery-charging",
      label: "Battery Status",
      value: `${currentDeviceInfoData?.Bat || "Nill"}`,
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
      value: currentDeviceInfoData?.JunctionId || "Nill",
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
