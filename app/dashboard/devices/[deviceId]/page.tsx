import DeviceConfiguration from "@/components/Device/DeviceConfiguration";
import IntersectionConfiguration from "@/components/Device/IntersectionConfiguration";
import FourWayIntersection from "@/components/IntersectionComponent/FourWayIntersection";

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
  console.log("Device ID", params);
  return (
    <section className="device">
      <div className="device__left">
        <FourWayIntersection />
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
