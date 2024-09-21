import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TrafficSignal from "./TrafficSignal";
import { IoMdAddCircle } from "react-icons/io";
import { motion } from "framer-motion";
import HttpRequest from "@/store/services/HttpRequest";
import { GetItemFromLocalStorage } from "@/utils/localStorageFunc";
import { emitToastMessage } from "@/utils/toastFunc";
import { MdCancel } from "react-icons/md";
import { getUserPhase } from "@/store/devices/UserDeviceSlice";
import { useAppDispatch } from "@/hooks/reduxHook";

interface SignalState {
  left: "R" | "A" | "G";
  straight: "R" | "A" | "G";
  right: "R" | "A" | "G";
  bike: "R" | "G" | "A";
  pedestrian: "R" | "G" | "A";
}

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

const IntersectionDisplay: React.FC<IntersectionDisplayProps> = ({
  initialSignals,
  backgroundImage,
  editable,
}) => {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [showInputModal, setShowInputModal] = useState<boolean>(false);
  const [isCreatingPhase, setIsCreatingPhase] = useState<boolean>(false);
  const [phaseName, setPhaseName] = useState<string>("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    setSignals(initialSignals);
  }, [initialSignals]);

  const handleSignalClick = (
    direction: "N" | "E" | "S" | "W",
    signalType: string,
    color: "R" | "A" | "G"
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
    console.log("Sending Phase Data:", phaseName, user);
    try {
      const encodeSignals = () => {
        return (
          "*" +
          signals
            .map((signal) => {
              return `${signal.direction}${signal.left}${signal.straight}${signal.right}${signal.bike}${signal.pedestrian}`;
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
  return (
    <Background $backgroundImage={backgroundImage}>
      {signals.map((signal) => {
        return (
          <TrafficSignal
            key={signal.direction}
            {...signal}
            editable={editable}
            onSignalClick={(direction, signalType, color) =>
              handleSignalClick(direction, signalType, color)
            }
            signals={signals}
          />
        );
      })}
      {editable && (
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
