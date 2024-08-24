import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OverlayModal from "../Modals/OverlayModal";
import LogoutModal from "../Modals/LogoutModal";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { GiExitDoor } from "react-icons/gi";

const Navigation = () => {
  const router = useRouter();
  const [showLogoutVerificationModal, setShowLogoutVerificationModal] =
    useState<boolean>(false);
  const [showLogoutText, setShowLogoutText] = useState(false);
  const loggedInLecturer = GetItemFromLocalStorage("user");

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let first;
  let last;

  if (loggedInLecturer) {
    [first, last] = loggedInLecturer?.name.split(" ");
  }

  return (
    <nav className="navigation">
      <figure
        style={{
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px",
        }}
        onClick={() => router.push("/")}
      >
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={isSmallScreen ? 40 : 60}
          height={isSmallScreen ? 40 : 60}
          style={{ objectFit: "cover" }}
        />
      </figure>

      <div>
        <button
          type="button"
          className="navigation-logout"
          onClick={() => setShowLogoutVerificationModal(true)}
          onMouseEnter={() => setShowLogoutText(true)}
          onMouseLeave={() => setShowLogoutText(false)}
        >
          <GiExitDoor className="icon" />
          {showLogoutText && <p className="navigation-title">Logout</p>}
        </button>
      </div>
      {showLogoutVerificationModal && (
        <OverlayModal onClose={() => setShowLogoutVerificationModal(false)}>
          <LogoutModal
            onClose={() => setShowLogoutVerificationModal(false)}
          ></LogoutModal>
        </OverlayModal>
      )}
    </nav>
  );
};
export default Navigation;
