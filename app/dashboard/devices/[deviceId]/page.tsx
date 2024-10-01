"use client";

import DeviceConfiguration from "@/components/Device/DeviceConfiguration";
import IntersectionConfiguration from "@/components/Device/IntersectionConfiguration";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  closePreviewCreatedPatternPhase,
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
  addCurrentDeviceProgData,
  getUserdeviceActiveProgData,
  getUserDeviceInfoData,
  updateDeviceAvailability,
  addCurrentDeviceStateData,
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
  const { deviceAvailability, currentDeviceInfoData, deviceActiveProgData } =
    useAppSelector((state) => state.userDevice);
  const dispatch = useAppDispatch();

  getWebSocket();

  const statuses = useDeviceStatus();

  const deviceId = params.deviceId;
  const icon =
    getDeviceStatus(statuses, deviceId) ||
    (deviceAvailability.Status && deviceAvailability.DeviceID === deviceId)
      ? "ON"
      : "OFF";

  const { isIntersectionConfigurable } = useAppSelector(
    (state) => state.signalConfig
  );

  useEffect(() => {
    dispatch(setIsIntersectionConfigurable(false));
  }, [dispatch, isIntersectionConfigurable]);

  // Fetch Device Config Data
  useEffect(() => {
    const socket = getWebSocket();
    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const startCountdown = (initialDuration: number, signalString: string) => {
      let timeLeft = initialDuration;

      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      countdownInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft -= 1;
          dispatch(
            previewCreatedPatternPhase({
              duration: timeLeft,
              signalString: signalString,
            })
          );
          dispatch(setSignalState());
        } else {
          clearInterval(countdownInterval!);
          countdownInterval = null;
          dispatch(closePreviewCreatedPatternPhase());
        }
      }, 1000);
    };

    const handleDataFeedback = (event: MessageEvent) => {
      const feedback = JSON.parse(event.data);
      if (feedback.event === "ping_received") return;

      console.log("Feedback", feedback);
      // I will Set the status to off anytme I fetch the state and the device power is off
      dispatch(
        updateDeviceAvailability({
          DeviceID: feedback.payload.DeviceID,
          Status: true,
        })
      );
      switch (feedback.event) {
        case "info_feedback":
          if (feedback.payload.error) {
            dispatch(
              addCurrentDeviceInfoData({
                Bat: "",
                Temp: "",
                Rtc: "",
                DeviceID: "",
              })
            );
            emitToastMessage("Could not fetch device info data", "error");
          } else {
            dispatch(addCurrentDeviceInfoData(feedback.payload));
          }
          break;

        case "sign_feedback":
          if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
          }

          if (feedback.payload.error) {
            dispatch(
              addCurrentDeviceSignalData({
                Countdown: "",
                Phase: "",
                DeviceID: "",
              })
            );
            emitToastMessage("Could not fetch device signal data", "error");
          } else {
            startCountdown(feedback.payload.Countdown, feedback.payload.Phase);
            dispatch(addCurrentDeviceSignalData(feedback.payload));
          }
          break;

        case "prog_feedback":
          if (feedback.payload.error) {
            dispatch(
              addCurrentDeviceProgData({
                DeviceID: "",
                Plan: "",
                Period: "",
                JunctionId: "",
              })
            );
            emitToastMessage("Could not fetch device prog data", "error");
          } else {
            dispatch(addCurrentDeviceProgData(feedback.payload));
          }
          break;

        case "state_feedback":
          if (feedback.payload.error) {
            dispatch(
              addCurrentDeviceStateData({
                DeviceID: "",
                Auto: false,
                Power: false,
                Manual: false,
                Next: false,
                Hold: false,
                Reset: false,
                Restart: false,
              })
            );
            emitToastMessage("Could not fetch device prog data", "error");
          } else {
            dispatch(addCurrentDeviceProgData(feedback.payload));
          }
          break;

        default:
          console.log("Unhandled event type:", feedback.event);
      }
    };

    socket?.addEventListener("message", handleDataFeedback);

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      socket?.removeEventListener("message", handleDataFeedback);
      dispatch(closePreviewCreatedPatternPhase());
    };
  }, [dispatch]);

  // Fetch Intersection Config Data
  useEffect(() => {
    if (!deviceActiveProgData?.JunctionId) {
      dispatch(getUserdeviceActiveProgData(params.deviceId));
    }
    if (!currentDeviceInfoData?.Rtc) {
      dispatch(getUserDeviceInfoData(params.deviceId));
    }

    // Fetch Device State Data
    const socket = getWebSocket();

    const sendMessage = () => {
      socket.send(
        JSON.stringify({
          event: "state_request",
          payload: {
            DeviceID: params.deviceId,
          },
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

    return () => {
      if (socket) {
        socket.close();
      }
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
      value: currentDeviceInfoData?.Temp
        ? `${currentDeviceInfoData.Temp}°C`
        : "Nill",
    },
    {
      iconName: "battery-charging",
      label: "Battery Status",
      value: currentDeviceInfoData?.Bat
        ? `${currentDeviceInfoData.Bat}V`
        : "Nill",
    },
    {
      iconName: "wifi",
      label: "WiFi Status",
      value: icon,
    },
  ];
  const intersectionConfigItems: IntersectionConfigItem[] = [
    {
      label: "Intersection Name",
      value: deviceActiveProgData?.JunctionId || "Nill",
    },
    {
      label: "Active Plan",
      value: deviceActiveProgData?.Plan || "Nill",
    },
    {
      label: "Period",
      value: deviceActiveProgData?.Period || "Nill",
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
            deviceId={params.deviceId}
          />
        </div>
      </div>
    </section>
  );
};

export default DeviceDetails;
