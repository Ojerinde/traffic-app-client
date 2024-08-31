import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import Button from "../UI/Button/Button";
import { useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { deviceTypes } from "@/utils/deviceTypes";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import HttpRequest from "@/store/services/HttpRequest";

interface AdminAddDeviceModalProps {
  closeModal: () => void;
}

interface FormValuesType {
  deviceType: string;
  deviceId: string;
}

const AdminAddDeviceModal: React.FC<AdminAddDeviceModalProps> = ({
  closeModal,
}) => {
  const [isAddingDevice, setisAddingDevice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const adminUser = GetItemFromLocalStorage("adminUser");
  const deviceType = deviceTypes.find(
    (dev) => dev.department === adminUser.department
  );

  const formik = useFormik<FormValuesType>({
    initialValues: {
      deviceType: `${deviceType?.type}`,
      deviceId: "",
    },
    validationSchema: Yup.object().shape({
      deviceType: Yup.string().required("Device Type is required"),
      deviceId: Yup.string().required("Device ID is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      const { deviceType, deviceId } = values;
      try {
        setisAddingDevice(true);
        const {
          data: { data },
        } = await HttpRequest.post("/admin/addDevice", {
          deviceId,
          deviceType,
          adminEmail: adminUser.email,
        });
        console.log("Admin add device sucess", data);
        setSuccessMessage(data.message);
        setisAddingDevice(false);
      } catch (error) {
        console.log("Admin add device error", error);
        setisAddingDevice(false);
      } finally {
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 7000);
      }
    },
  });

  return (
    <div className="addDeviceOverlay">
      <div className="" onClick={closeModal}>
        <MdOutlineClose className="addDeviceOverlay-icon" />
      </div>

      <h2 className="addDeviceOverlay-text">Add Device</h2>
      <form onSubmit={formik.handleSubmit}>
        <InformationInput
          id="deviceType"
          type="text"
          name="deviceType"
          value={deviceType?.type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.deviceType}
          invalid={!!formik.errors.deviceType && formik.touched.deviceType}
          placeholder={deviceType?.type}
          readOnly
        />

        <InformationInput
          id="deviceId"
          type="deviceId"
          name="deviceId"
          value={formik.values.deviceId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.deviceId}
          invalid={!!formik.errors.deviceId && formik.touched.deviceId}
          placeholder="Enter the Device ID"
        />
        {errorMessage && <p className="signup-error">{errorMessage}</p>}
        {successMessage && <p className="signup-success">{successMessage}</p>}

        <Button type="submit" disabled={isAddingDevice || !formik.isValid}>
          {isAddingDevice ? "Adding..." : "Add"}
        </Button>
      </form>
    </div>
  );
};
export default AdminAddDeviceModal;
