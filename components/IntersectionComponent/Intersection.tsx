import React, { useState } from "react";
import styled from "styled-components";
import TrafficSignal from "./TrafficSignal";

interface SignalState {
  left: "R" | "A" | "G";
  straight: "R" | "A" | "G";
  right: "R" | "A" | "G";
  bike: "R" | "G" | "A";
  pedestrian: "R" | "G" | "A";
}

interface Signal extends SignalState {
  direction: "N" | "E" | "S" | "W";
  position: { top: number; left: number };
  pedestrianPosition: { top: number; left: number };
  orientation: "horizontal" | "vertical";
}

interface IntersectionDisplayProps {
  initialSignals: Signal[];
  backgroundImage: string;
  editable: boolean;
}

const Background = styled.div<{ backgroundImage: string }>`
  position: relative;
  width: 100%;
  height: 80vh;
  margin-top: 3rem;
  border: none;
  background-image: url(${({ backgroundImage }) => backgroundImage});
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
  background-size: cover;
  background-position: center;
`;

const AddPhaseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const PhaseNameInput = styled.input`
  position: absolute;
  top: 10px;
  right: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const IntersectionDisplay: React.FC<IntersectionDisplayProps> = ({
  initialSignals,
  backgroundImage,
  editable,
}) => {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [phaseName, setPhaseName] = useState<string>("");

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

    try {
      console.log("Sending Phase Data:", phaseName, signals);
    } catch (error) {
      console.error("Error adding phase:", error);
    }
  };

  return (
    <Background backgroundImage={backgroundImage}>
      {signals.map((signal, index) => (
        <TrafficSignal
          key={index}
          {...signal}
          editable={editable}
          onSignalClick={(direction, signalType, color) =>
            handleSignalClick(direction, signalType, color)
          }
        />
      ))}
      {editable && (
        <>
          <PhaseNameInput
            type="text"
            placeholder="Enter phase name"
            value={phaseName}
            onChange={(e) => setPhaseName(e.target.value)}
          />
          <AddPhaseButton onClick={handleAddPhase}>Add Phase</AddPhaseButton>
        </>
      )}
    </Background>
  );
};

export default IntersectionDisplay;
