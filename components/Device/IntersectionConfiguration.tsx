"use client";

import { IntersectionConfigItem } from "@/app/dashboard/devices/[deviceId]/page";
import { useRouter, usePathname } from "next/navigation";
import IntersectionConfigurationItem from "./IntersectionConfigurationItem";
import { useAppDispatch } from "@/hooks/reduxHook";
import {
  closePreviewCreatedPatternPhase,
  previewCreatedPatternPhase,
} from "@/store/signals/SignalConfigSlice";

interface DeviceConfigurationProps {
  intersectionConfigItems: IntersectionConfigItem[];
}
const IntersectionConfiguration: React.FC<DeviceConfigurationProps> = ({
  intersectionConfigItems,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

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
        <p>The buttons comes here</p>
      </div>
    </section>
  );
};

export default IntersectionConfiguration;
