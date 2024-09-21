"use client";

import DeviceConfiguration from "@/components/Device/DeviceConfiguration";
import IntersectionConfiguration from "@/components/Device/IntersectionConfiguration";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { setIsIntersectionConfigurable } from "@/store/signals/SignalConfigSlice";
import { useEffect } from "react";

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

const deviceConfigItems: DeviceConfigItem[] = [
  {
    iconName: "calendar",
    label: "Date",
    value: "Monday 31/08/2024",
  },
  {
    iconName: "clock",
    label: "Time",
    value: "12:00",
  },
  {
    iconName: "battery-charging",
    label: "Battery Status",
    value: "Charging: 85%",
  },
  {
    iconName: "wifi",
    label: "WiFi Status",
    value: "Disconnected",
  },
];
const intersectionConfigItems: IntersectionConfigItem[] = [
  {
    label: "Intersection Name or ID",
    value: "Sarab Junction",
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

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ params }) => {
  const dispatch = useAppDispatch();
  const { isIntersectionConfigurable } = useAppSelector(
    (state) => state.signalConfig
  );
  useEffect(() => {
    dispatch(setIsIntersectionConfigurable(false));
  }, [dispatch]);

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
