"use client";

import { getWebSocket } from "@/app/dashboard/websocket";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { getUserPlan } from "@/store/devices/UserDeviceSlice";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdUpload } from "react-icons/md";

interface BoxThreeProps {}
const BoxThree: React.FC<BoxThreeProps> = ({}) => {
  const router = useRouter();
  const params = useParams();
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

  useEffect(() => {
    dispatch(getUserPlan(email));
  }, [dispatch]);

  const handleDeletePlan = async (planId: string, planName: string) => {
    const confirmResult = confirm(
      `Are you sure you want to delete "${planName}" plan?`
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

  const handleUploadPlan = async (
    planId: string,
    planName: string,
    showConfirmation = true
  ) => {
    if (showConfirmation) {
      const confirmResult = confirm(
        `Are you sure you want to upload "${planName}" plan?`
      );
      if (!confirmResult) return;
    }
    try {
      const plan = plans.find((plan) => plan.id === planId);
      console.log("The Selected Plan", plan?.schedule);
      if (!plan || !plan.schedule) {
        console.error("Invalid plan or missing schedule");
        return;
      }

      const socket = getWebSocket();

      const sendMessage = (timeSegmentKey: string, timeSegment: any) => {
        return new Promise<void>((resolve) => {
          socket.send(
            JSON.stringify({
              event: "upload_request",
              payload: {
                DeviceID: params.deviceId,
                email,
                plan: plan.name,
                timeSegment: timeSegmentKey,
                patternName: timeSegment.label,
              },
            })
          );

          socket.onmessage = (event: MessageEvent) => {
            const feedback = JSON.parse(event.data);
            if (feedback.event !== "upload_feedback") return;
            console.log(feedback, plan.name, timeSegmentKey);
            if (
              feedback.payload.Plan === plan.name &&
              feedback.payload.Period === timeSegmentKey
            ) {
              console.log("Upload success for time segment:", feedback);
              resolve();
            }
          };
        });
      };

      let lastValidSegment = null;

      for (const timeSegmentKey of Object.keys(plan.schedule)) {
        let timeSegment = plan.schedule[timeSegmentKey];

        if (!timeSegment || !timeSegment.value) {
          if (lastValidSegment) {
            timeSegment = lastValidSegment;
          }
        } else {
          lastValidSegment = timeSegment;
        }

        if (timeSegment && timeSegment.value) {
          console.log(
            `Uploading time segment: ${timeSegment.value} at ${timeSegmentKey}`
          );
          await sendMessage(timeSegmentKey, timeSegment);
        }
      }

      console.log(`All segments uploaded for plan: ${plan.name}`);
    } catch (error: any) {
      emitToastMessage(
        error?.response?.data?.message || "Upload failed",
        "error"
      );
    }
  };

  const handleUploadAllPlan = async () => {
    const confirmResult = confirm(
      "Are you sure you want to upload all the plans?"
    );
    if (!confirmResult) return;

    try {
      for (const plan of plans) {
        if (plan && plan.id && plan.name) {
          console.log(`Uploading plan: ${plan.name}`);
          await handleUploadPlan(plan.id, plan.name, false);
        }
      }

      emitToastMessage("All plans uploaded successfully!", "success");
    } catch (error: any) {
      console.error("Error uploading all plans:", error);
      emitToastMessage(
        error?.response?.data?.message || "Failed to upload all plans",
        "error"
      );
    }
  };

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
                    <div>
                      <button
                        onClick={() => {
                          handleUploadPlan(plan.id, plan.name);
                        }}
                      >
                        <MdUpload />
                      </button>
                      <button
                        onClick={() => {
                          handleDeletePlan(plan.id, plan.name);
                        }}
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="plans__noPlans">
            You have not created any schedule yet.
          </div>
        )}
      </div>
      <button onClick={() => router.push(newPathname)}>
        Go to schedule page
      </button>
      <button onClick={handleUploadAllPlan}>Upload All Plans</button>
    </div>
  );
};
export default BoxThree;
