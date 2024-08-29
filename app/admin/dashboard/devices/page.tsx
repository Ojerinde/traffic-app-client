"use client";

import AddDeviceModal from "@/components/Modals/AddDeviceModal";
import OverlayModal from "@/components/Modals/OverlayModal";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FaBook, FaPlus } from "react-icons/fa";
import { RiCreativeCommonsZeroFill } from "react-icons/ri";

const Devices = () => {
  const devices: [] = [];
  const pathname = usePathname();
  const router = useRouter();
  const [showAddDeviceModal, setShowAddDeviceModal] = useState<boolean>(false);

  const handleRedirectionToDevicePage = (deviceId: string) => {
    router.push(`${pathname}/${deviceId}`);
  };
  return (
    <aside>
      <div className="devices-header">
        <h2 className="page-header">My Devices </h2>{" "}
        <button onClick={() => setShowAddDeviceModal(true)}>
          <FaPlus /> Add New
        </button>
        {showAddDeviceModal && (
          <OverlayModal onClose={() => setShowAddDeviceModal(false)}>
            <AddDeviceModal closeModal={() => setShowAddDeviceModal(false)} />
          </OverlayModal>
        )}
      </div>
      {devices.length === 0 && (
        <div className="devices-nodevice">
          <RiCreativeCommonsZeroFill />
          <p>
            You haven't created any device yet, kindly add a device to continue.
          </p>
          <button
            className="devices-button"
            onClick={() => setShowAddDeviceModal(true)}
          >
            Add Device
          </button>
        </div>
      )}
      <ul className="devices-list">
        {devices.map((device: any, index) => (
          <li key={index} className="devices-item">
            <FaBook className="devices-item__icon" />
            <div className="devices-item__details">
              <h3
                onClick={() => handleRedirectionToDevicePage(device.deviceId)}
              >
                {device.type}
              </h3>
              <p>{device.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};
export default Devices;
