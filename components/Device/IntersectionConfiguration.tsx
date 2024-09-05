"use client";

import { IntersectionConfigItem } from "@/app/dashboard/devices/[deviceId]/page";
import { useRouter, usePathname } from "next/navigation";
import IntersectionConfigurationItem from "./IntersectionConfigurationItem";

interface DeviceConfigurationProps {
  intersectionConfigItems: IntersectionConfigItem[];
}
const IntersectionConfiguration: React.FC<DeviceConfigurationProps> = ({
  intersectionConfigItems,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="intersectionConfiguration">
      <div className="intersectionConfiguration__header">
        <h2>Interface Configuration</h2>
        <button
          type="button"
          onClick={() => router.push(`${pathname}/intersection_configuration`)}
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
    </section>
  );
};

export default IntersectionConfiguration;
