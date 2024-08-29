import { useFormik } from "formik";
import * as Yup from "yup";
import InformationInput from "../UI/Input/InformationInput";
import Button from "../UI/Button/Button";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { emitToastMessage } from "@/utils/toastFunc";

interface AdminAddDeviceModalProps {
  closeModal: () => void;
}

interface FormValuesType {
  deviceName: string;
  deviceId: string;
}

const AdminAddDeviceModal: React.FC<AdminAddDeviceModalProps> = ({
  closeModal,
}) => {
  const [isAddingDevice, setisAddingDevice] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik<FormValuesType>({
    initialValues: {
      deviceName: "",
      deviceId: "",
    },
    validationSchema: Yup.object().shape({
      deviceName: Yup.string()
        .required("Name is required")
        .test(
          "full-name",
          "Name must include both first name and last name",
          (value) => {
            if (!value) {
              return false;
            }
            return value.trim().split(" ").length === 2;
          }
        ),
      deviceId: Yup.string()
        .required("Matriculation number is required")
        .matches(
          /^\d{2}\/\d{2}[A-Z]{2}\d{3}$/,
          "Matriculation number must be in the format 18/30GC056"
        ),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: true,
    onSubmit: async (values, actions) => {
      const { deviceName, deviceId } = values;
      try {
      } catch (error) {
      } finally {
        setTimeout(() => {
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
          id="deviceName"
          type="text"
          name="name"
          value={formik.values.deviceName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          inputErrorMessage={formik.errors.deviceName}
          invalid={!!formik.errors.deviceName && formik.touched.deviceName}
          placeholder="E.g Device Name"
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
          placeholder="E.g 123456erert6564546etyyet"
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
