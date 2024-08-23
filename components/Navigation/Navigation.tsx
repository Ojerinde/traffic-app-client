import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import OverlayModal from "../Modals/OverlayModal";
import LogoutModal from "../Modals/LogoutModal";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { GiExitDoor } from "react-icons/gi";

const Navigation = () => {
  const url = usePathname();

  const pathToNavigateTo = url.includes("/level_adviser")
    ? "/level_adviser/dashboard/profile"
    : "/update_profile";

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
          boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.6)",
        }}
        onClick={() => router.push(pathToNavigateTo)}
      >
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={isSmallScreen ? 50 : 100}
          height={isSmallScreen ? 40 : 80}
          style={{ objectFit: "cover" }}
        />
      </figure>

      <div className="navigation-text">
        {`Greetings, ${loggedInLecturer?.title} ${first} ${last?.[0]}.`}
      </div>
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
