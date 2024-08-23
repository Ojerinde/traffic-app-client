"use client";
import ClearFingerprintOnSensor from "@/components/Modals/ClearFingerprintsOnSensorModal";
import DeactivateUserModal from "@/components/Modals/DeactivateUserModal";
import OverlayModal from "@/components/Modals/OverlayModal";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import Link from "next/link";
import { useState } from "react";

const Settings = () => {
  const [deactivateUser, setDeactivateUser] = useState<boolean>(false);
  const [clearAllFingerprints, setClearFingerprints] = useState<boolean>(false);
  const user = GetItemFromLocalStorage("user");
  return (
    <div>
      <h2 className="courses-header">Settings </h2>
      <Link className="settings_url" href="/update_profile">
        Update profile
      </Link>
      <Link className="settings_url" href="/dashboard/settings/change_password">
        Change Password
      </Link>
      <Link className="settings_url" href="/dashboard/archived_records">
        See Archived Records
      </Link>
      <div>
        <button
          onClick={() => setClearFingerprints(true)}
          className="coursePage-button"
        >
          Clear All Fingerprints
        </button>
      </div>
      <div>
        <button
          onClick={() => setDeactivateUser(true)}
          className="coursePage-button"
        >
          Deactivate Account
        </button>
      </div>

      {/* Reset Modal */}
      {deactivateUser && (
        <OverlayModal onClose={() => setDeactivateUser(false)}>
          <DeactivateUserModal
            email={user?.email}
            closeModal={() => setDeactivateUser(false)}
          />
        </OverlayModal>
      )}
      {clearAllFingerprints && (
        <OverlayModal onClose={() => setClearFingerprints(false)}>
          <ClearFingerprintOnSensor
            closeModal={() => setClearFingerprints(false)}
          />
        </OverlayModal>
      )}
    </div>
  );
};
export default Settings;
