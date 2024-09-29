"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { getUserPlan } from "@/store/devices/UserDeviceSlice";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface BoxThreeProps {}
const BoxThree: React.FC<BoxThreeProps> = ({}) => {
  const router = useRouter();
  const pathname = usePathname();
  const newPathname =
    pathname.slice(0, pathname.lastIndexOf("/")) + "/schedule";
  const dispatch = useAppDispatch();
  const email = GetItemFromLocalStorage("user")?.email;

  const { plans } = useAppSelector((state) => state.userDevice);
  const [searchedResult, setSearchedResult] = useState<any[]>([]);
  const [showSearchedResult, setShowSearchedResult] = useState<boolean>(false);
  const [inputtedPlanName, setInputtedPlanName] = useState<string>("");

  const searchPlanByName = (planName: string) => {
    const matchedPhases = plans.filter((plan) =>
      plan.name.toLowerCase().includes(planName.toLowerCase())
    );
    setSearchedResult(matchedPhases);
  };
  const plansToShow = showSearchedResult ? searchedResult : plans;

  const handleDeletePlan = async (planId: string, planName: string) => {
    const confirmResult = confirm(
      `Are you sure you want to delete "${planName}" pattern?`
    );
    if (!confirmResult) return;
    try {
      const { data } = await HttpRequest.delete(`/plans/${planId}/${email}`);
      emitToastMessage(data.message, "success");
      dispatch(getUserPlan(email));
    } catch (error: any) {
      emitToastMessage(error?.response.data.message, "error");
    }
  };
  useEffect(() => {
    dispatch(getUserPlan(email));
  }, [dispatch]);

  return (
    <div className="boxThree">
      <div>
        {plans?.length > 0 ? (
          <>
            <div className="plans__header">
              <h2>Available Plan(s)</h2>
              <form
                action=""
                onSubmit={(e: any) => {
                  e.preventDefault();
                  searchPlanByName(inputtedPlanName);
                }}
              >
                <input
                  type="text"
                  placeholder="Find a plan by its name"
                  value={inputtedPlanName}
                  onChange={(e) => {
                    setInputtedPlanName(e.target.value);
                    searchPlanByName(e.target.value);
                    setShowSearchedResult(true);
                  }}
                />
              </form>
            </div>
            <ul className="plans">
              {plansToShow?.map((plan, index) => (
                <li className="plans__list" key={index}>
                  <div className="plans__list--item">
                    <h3>{plan.name}</h3>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        handleDeletePlan(plan.id, plan.name);
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="plans__noPlan">
            You have not created any schedule yet.
          </div>
        )}
      </div>
      <button onClick={() => router.push(newPathname)}>
        Go to schedule page
      </button>
    </div>
  );
};
export default BoxThree;
