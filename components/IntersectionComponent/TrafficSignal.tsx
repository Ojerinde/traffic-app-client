import React, { useState } from "react";
import { ImManWoman } from "react-icons/im";
import styled from "styled-components";

type Direction = "N" | "E" | "S" | "W";
type LightColor = "R" | "A" | "G"; // Include Amber (A)

interface TrafficSignalProps {
  direction: Direction;
  left: LightColor;
  straight: LightColor;
  right: LightColor;
  bike: LightColor;
  pedestrian: LightColor;
  position: { top: number; left: number };
  orientation: "horizontal" | "vertical";
  pedestrianPosition: { top: number; left: number };
  editable: boolean;
  onSignalClick: (
    direction: Direction,
    signalType: string,
    currentColor: LightColor
  ) => void;
}

const SignalWrapper = styled.div<{
  orientation: "horizontal" | "vertical";
  position: { top: number; left: number };
}>`
  position: absolute;
  top: ${({ position }) => `${position.top}%`};
  left: ${({ position }) => `${position.left}%`};
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === "horizontal" ? "row" : "column"};
  align-items: center;
  justify-content: center;
`;

const SignalLight = styled.div<{ color: LightColor }>`
  width: 1.6rem;
  height: 1.6rem;
  background-color: ${({ color }) =>
    color === "R" ? "red" : color === "A" ? "orange" : "green"};
  margin: 1px;
  border-radius: 50%;
  cursor: pointer;
`;

const PedestrianSignalLight = styled.div<{ color: LightColor }>`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: ${({ color }) => (color === "R" ? "red" : "green")};
  cursor: pointer;
`;

const SignalGroup = styled.div<{ orientation: "horizontal" | "vertical" }>`
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === "horizontal" ? "column" : "row"};
  margin: 0 2px;
`;

const TrafficSignal: React.FC<TrafficSignalProps> = ({
  left,
  straight,
  right,
  bike,
  pedestrian,
  position,
  orientation,
  direction,
  pedestrianPosition,
  editable,
  onSignalClick,
}) => {
  const [signalColors, setSignalColors] = useState({
    left,
    straight,
    right,
    bike,
    pedestrian,
  });

  // Toggle only between Red and Green on click
  const handleSignalClick = (signalType: string) => {
    if (!editable) return;
    const currentColor = signalColors[signalType as keyof typeof signalColors];
    const newColor = currentColor === "R" ? "G" : "R"; // Toggle R <-> G

    setSignalColors((prevColors) => ({
      ...prevColors,
      [signalType]: newColor,
    }));

    onSignalClick(direction, signalType, newColor);
  };

  return (
    <SignalWrapper orientation={orientation} position={position}>
      <SignalGroup orientation={orientation}>
        {direction === "N" || direction === "E" ? (
          <>
            <div
              style={{
                position: "absolute",
                top: pedestrianPosition.top,
                left: pedestrianPosition.left,
                backgroundColor: "#2a2a29",
                padding: ".7rem",
                borderRadius: "50%",
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                onClick={() => handleSignalClick("pedestrian")}
              >
                <ImManWoman fontSize={20} />
              </PedestrianSignalLight>
            </div>
            <SignalLight
              color={signalColors.bike}
              onClick={() => handleSignalClick("bike")}
            />
            <SignalLight
              color={signalColors.right}
              onClick={() => handleSignalClick("right")}
            />
            <SignalLight
              color={signalColors.straight}
              onClick={() => handleSignalClick("straight")}
            />
            <SignalLight
              color={signalColors.left}
              onClick={() => handleSignalClick("left")}
            />
          </>
        ) : (
          <>
            <SignalLight
              color={signalColors.left}
              onClick={() => handleSignalClick("left")}
            />
            <SignalLight
              color={signalColors.straight}
              onClick={() => handleSignalClick("straight")}
            />
            <SignalLight
              color={signalColors.right}
              onClick={() => handleSignalClick("right")}
            />
            <SignalLight
              color={signalColors.bike}
              onClick={() => handleSignalClick("bike")}
            />
            <div
              style={{
                position: "absolute",
                top: pedestrianPosition.top,
                left: pedestrianPosition.left,
                backgroundColor: "#2a2a29",
                padding: ".7rem",
                borderRadius: "50%",
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                onClick={() => handleSignalClick("pedestrian")}
              >
                <ImManWoman size={20} />
              </PedestrianSignalLight>
            </div>
          </>
        )}
      </SignalGroup>
    </SignalWrapper>
  );
};

export default TrafficSignal;
