import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TrafficSignal from "./TrafficSignal";
import { IoMdAddCircle } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { motion } from "framer-motion";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import { MdCancel } from "react-icons/md";
import { getUserPhase } from "@/store/devices/UserDeviceSlice";
import { useAppDispatch } from "@/hooks/reduxHook";
import {
  setManualMode,
  setSignalStringToAllRed,
  SignalState,
} from "@/store/signals/SignalConfigSlice";
import { getWebSocket } from "@/app/dashboard/websocket";
import { useParams } from "next/navigation";

export interface Signal extends SignalState {
  direction: "N" | "E" | "S" | "W";
  position: { top: number; left: number };
  pedestrianPosition: {
    first: { top: number; left: number };
    second: { top: number; left: number };
  };
  orientation: "horizontal" | "vertical";
}
interface IntersectionDisplayProps {
  initialSignals: Signal[];
  backgroundImage: string;
  editable: boolean;
  createdPatternPhasePreviewing: {
    duration: number | null;
    showDuration: boolean;
  };
  manualMode: boolean;
}

const Background = styled.div<{ $backgroundImage: string }>`
  position: relative;
  width: 100%;
  height: 80vh;
  border: none;
  background-image: url(${({ $backgroundImage }) => $backgroundImage});
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  background-size: cover;
  background-position: center;

  @media screen and (max-width: 1300px) {
    background-size: contain;
    background-repeat: no-repeat;
    height: 65vh;
  }
  @media screen and (max-width: 1100px) {
    height: 55vh;
  }
  @media screen and (max-width: 900px) {
    height: 50vh;
  }
`;

const PhaseContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40%;
  background-color: grey;
  padding: 0.4rem;
  border-radius: 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
`;
const PhaseNameInput = styled.input`
  padding: 0.5rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
  font-size: 1.4rem;
  width: 100%;

  &:focus {
    outline: none;
    border-color: #514604;
  }

  &:hover {
    border-color: #2a2a29;
  }
`;
const AddPhaseButton = styled.button`
  padding: 0.8rem 1rem;
  background-color: #514604;
  color: white;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 1.4rem;
  width: 100%;

  &:hover {
    border-color: #2a2a29;
  }
`;
const AddPhaseIcon = styled(motion.div)`
  position: absolute;
  top: 44.4%;
  left: 45%;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 50%;
`;
const AddManualIcon = styled(motion.div)`
  position: absolute;
  top: 44.4%;
  left: 45%;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 50%;
`;

const DurationDisplay = styled.div`
  position: absolute;
  top: 44.4%;
  left: 45%;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  width: 5.2rem;
  height: 5.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-size: 2rem;
`;
const IntersectionDisplay: React.FC<IntersectionDisplayProps> = ({
  initialSignals,
  backgroundImage,
  editable,
  manualMode,
  createdPatternPhasePreviewing,
}) => {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [isCreatingPhase, setIsCreatingPhase] = useState<boolean>(false);
  const [phaseName, setPhaseName] = useState<string>("");
  const params = useParams();
  const dispatch = useAppDispatch();
  // console.log("Initial signals", initialSignals);
  useEffect(() => {
    setSignals(initialSignals);
  }, [initialSignals]);

  const handleSignalClick = (
    direction: "N" | "E" | "S" | "W",
    signalType: string,
    color: "R" | "A" | "G" | "X"
  ) => {
    setSignals((prevSignals) =>
      prevSignals.map((signal) =>
        signal.direction === direction
          ? {
              ...signal,
              [signalType]: color,
            }
          : signal
      )
    );
  };

  const handleAddPhase = async () => {
    if (!phaseName) {
      alert("Please enter a name for the phase.");
      return;
    }
    setIsCreatingPhase(true);
    const user = GetItemFromLocalStorage("user");

    const getAdjacentPedestrianSignal = (
      signals: Signal[],
      direction: "N" | "E" | "S" | "W"
    ): "R" | "G" | "X" => {
      // Find the adjacent signal direction based on the current direction
      let adjacentDirection: "N" | "E" | "S" | "W";

      switch (direction) {
        case "S":
          adjacentDirection = "E";
          break;
        case "E":
          adjacentDirection = "N";
          break;
        case "N":
          adjacentDirection = "W";
          break;
        case "W":
          adjacentDirection = "S";
          break;
        default:
          adjacentDirection = "N";
      }

      // Find the signal with the adjacent direction and return its pedestrian signal
      const adjacentSignal = signals.find(
        (signal) => signal.direction === adjacentDirection
      );

      return adjacentSignal ? adjacentSignal.pedestrian : "X";
    };

    try {
      const encodeSignals = () => {
        return (
          "*" +
          signals
            .map((signal) => {
              const adjacentPedestrian = getAdjacentPedestrianSignal(
                signals,
                signal.direction
              );

              return `${signal.direction}${signal.left}${signal.straight}${signal.right}${signal.bike}${signal.pedestrian}${adjacentPedestrian}`;
            })
            .join("") +
          "#"
        );
      };
      const encodedSignals = encodeSignals();
      const { data } = await HttpRequest.post("/phases", {
        email: user.email,
        phaseName,
        phaseData: encodedSignals,
      });
      console.log("response", data);
      emitToastMessage(data.message, "success");
      dispatch(getUserPhase(user.email));
      setIsCreatingPhase(false);
      setPhaseName("");
      setShowInputModal(false);
    } catch (error: any) {
      console.error("Error adding phase:", error);
      emitToastMessage(error?.response.data.message, "error");
      setIsCreatingPhase(false);
    }
  };

  const handleManualPhase = async () => {
    const user = GetItemFromLocalStorage("user");

    const getAdjacentPedestrianSignal = (
      signals: Signal[],
      direction: "N" | "E" | "S" | "W"
    ): "R" | "G" | "X" => {
      let adjacentDirection: "N" | "E" | "S" | "W";

      switch (direction) {
        case "S":
          adjacentDirection = "E";
          break;
        case "E":
          adjacentDirection = "N";
          break;
        case "N":
          adjacentDirection = "W";
          break;
        case "W":
          adjacentDirection = "S";
          break;
        default:
          adjacentDirection = "N";
      }

      const adjacentSignal = signals.find(
        (signal) => signal.direction === adjacentDirection
      );

      return adjacentSignal ? adjacentSignal.pedestrian : "X";
    };

    const encodeSignals = () => {
      return (
        "*" +
        signals
          .map((signal) => {
            const adjacentPedestrian = getAdjacentPedestrianSignal(
              signals,
              signal.direction
            );

            return `${signal.direction}${signal.left}${signal.straight}${signal.right}${signal.bike}${signal.pedestrian}${adjacentPedestrian}`;
          })
          .join("") +
        "#"
      );
    };
    const encodedSignals = encodeSignals();
    const promptResult = prompt(
      `Enter the duration in seconds for ${encodedSignals} phase`
    );
    // Send a webscoket event to the device to start the phase
    const socket = getWebSocket();

    const sendMessage = () => {
      socket.send(
        JSON.stringify({
          event: "intersection_control_request",
          payload: {
            action: "Manual",
            DeviceID: params.deviceId,
            signalString: encodedSignals,
            duration: promptResult,
          },
        })
      );
    };

    if (socket.readyState === WebSocket.OPEN) {
      sendMessage();
    } else {
      socket.onopen = () => {
        sendMessage();
      };
    }

    dispatch(setManualMode(false));
    dispatch(setSignalStringToAllRed());
  };

  return (
    <Background $backgroundImage={backgroundImage}>
      {signals.map((signal) => (
        <TrafficSignal
          key={signal.direction}
          {...signal}
          editable={editable}
          manualMode={manualMode}
          onSignalClick={(direction, signalType, color) =>
            handleSignalClick(direction, signalType, color)
          }
          signals={signals}
        />
      ))}
      {editable && !createdPatternPhasePreviewing.showDuration && (
        <AddPhaseIcon
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => setShowInputModal((prev) => !prev)}
        >
          {!showInputModal ? (
            <IoMdAddCircle size={52} />
          ) : (
            <MdCancel size={52} />
          )}
        </AddPhaseIcon>
      )}
      {manualMode && (
        <AddManualIcon
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={handleManualPhase}
        >
          <IoCheckmarkDoneCircleSharp size={52} />
        </AddManualIcon>
      )}
      {createdPatternPhasePreviewing.showDuration &&
        createdPatternPhasePreviewing.duration !== null && (
          <DurationDisplay>
            {createdPatternPhasePreviewing.duration}s
          </DurationDisplay>
        )}
      {showInputModal && (
        <PhaseContainer>
          <PhaseNameInput
            type="text"
            placeholder="Enter phase name"
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
          />
          <AddPhaseButton onClick={handleAddPhase}>
            {isCreatingPhase ? "Creating..." : "Create"}
          </AddPhaseButton>
        </PhaseContainer>
      )}
    </Background>
  );
};

export default IntersectionDisplay;
