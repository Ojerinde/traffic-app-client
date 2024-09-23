"use client";

import { usePathname, useRouter } from "next/navigation";

interface BoxThreeProps {}
const BoxThree: React.FC<BoxThreeProps> = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const newPathname =
    pathname.slice(0, pathname.lastIndexOf("/")) + "/schedule";
  return (
    <div className="boxThree">
      <button onClick={() => router.push(newPathname)}>
        Go to schedule page
      </button>
    </div>
  );
};
export default BoxThree;
