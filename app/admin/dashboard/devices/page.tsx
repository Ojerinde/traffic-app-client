"use client";

import AdminAddDeviceModal from "@/components/Modals/AdminAddDeviceModal";
import OverlayModal from "@/components/Modals/OverlayModal";
import HttpRequest from "@/store/services/HttpRequest";
import { deviceTypes } from "@/utils/deviceTypes";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { BsDeviceSsd } from "react-icons/bs";
import { RiCreativeCommonsZeroFill } from "react-icons/ri";
import { initializeWebSocket } from "@/app/dashboard/websocket";
import Toggle from "@/components/UI/Toggle/Toggle";

const Devices = () => {
  const [devices, setDevices] = useState<any[]>([]);
  // const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const [showAddDeviceModal, setShowAddDeviceModal] = useState<boolean>(false);

  const handleRedirectionToDevicePage = (deviceId: string) => {
    router.push(`${pathname}/${deviceId}`);
  };

  // Just for testing: Remeber to create a store for this.
  const adminUser = GetItemFromLocalStorage("user");
  const deviceType = deviceTypes.find(
    (dev) => dev.department === adminUser?.department
  );

  useEffect(() => {
    const getAlDevices = async () => {
      try {
        const { data } = await HttpRequest.get(
          `/admin/getDevice/${deviceType?.department}`
        );
        console.log("data", data);
        setDevices(data.devices);
      } catch (error) {
        console.log("error", error);
      }
    };
    getAlDevices();
  }, [deviceType?.department]);

  useEffect(() => {
    const ws = initializeWebSocket();

    const handleWebSocketMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (message.event === "ping_received" && message.source === "hardware") {
        console.log("Ping received from hardware at:", message.timestamp);
        setStatus(true);
        // setStatuses((prevStatuses) => ({
        //   ...prevStatuses,
        //   [message.deviceId]: "online",
        // }));
      }
    };

    if (ws) {
      ws.onmessage = handleWebSocketMessage;
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <aside>
      <div className="devices-header">
        <h2 className="page-header">My Devices </h2>{" "}
        <button onClick={() => setShowAddDeviceModal(true)}>
          <FaPlus /> Add New
        </button>
        {showAddDeviceModal && (
          <OverlayModal onClose={() => setShowAddDeviceModal(false)}>
            <AdminAddDeviceModal
              closeModal={() => setShowAddDeviceModal(false)}
            />
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
            <BsDeviceSsd className="devices-item__icon" />
            <div className="devices-item__details">
              <h3
                onClick={() => handleRedirectionToDevicePage(device.deviceId)}
              >
                {device.deviceType}
              </h3>
              <p>{device.deviceId}</p>
            </div>
            {/* <p> status: {statuses[device.deviceId] || "offline"} </p> */}
            <p>
              {" "}
              Status:{" "}
              {status ? (
                <FaToggleOn className="devices-icon_on" />
              ) : (
                <FaToggleOff className="devices-icon_off" />
              )}{" "}
            </p>
            {/* <Toggle type="a" checked={status} /> */}
          </li>
        ))}
      </ul>
    </aside>
  );
};
export default Devices;
