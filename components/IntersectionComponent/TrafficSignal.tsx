import { emitToastMessage } from "@/utils/toastFunc";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Signal } from "./Intersection";
import { checkForConflicts } from "@/utils/conflictChecker";
import { useAppSelector } from "@/hooks/reduxHook";

type Direction = "N" | "E" | "S" | "W";
type LightColor = "R" | "A" | "G" | "X";
type PedestrianLightColor = "R" | "G" | "X";

interface TrafficSignalProps {
  direction: Direction;
  left: LightColor;
  straight: LightColor;
  right: LightColor;
  bike: LightColor;
  pedestrian: PedestrianLightColor;
  position: { top: number; left: number };
  orientation: "horizontal" | "vertical";
  pedestrianPosition: {
    first: { top: number; left: number };
    second: { top: number; left: number };
  };
  editable: boolean;
  onSignalClick: (
    direction: Direction,
    signalType: string,
    currentColor: LightColor
  ) => void;
  signals: Signal[];
}

const SignalWrapper = styled.div<{
  orientation: "horizontal" | "vertical";
  $position: { top: number; left: number };
}>`
  position: absolute;
  top: ${({ $position }) => `${$position.top}%`};
  left: ${({ $position }) => `${$position.left}%`};
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === "horizontal" ? "row" : "column"};
  align-items: center;
  justify-content: center;
`;

const SignalLight = styled.div<{ color: LightColor; editable: boolean }>`
  width: 1.6rem;
  height: 1.6rem;
  background-color: ${({ color }) =>
    color === "R"
      ? "red"
      : color === "A"
      ? "orange"
      : color === "G"
      ? "green"
      : "grey"};
  margin: 1px;
  border-radius: 50%;
  cursor: ${({ editable }) => (editable ? "pointer" : "default")};
`;

const PedestrianSignalLight = styled.div<{
  orientation: "horizontal" | "vertical";
  color: PedestrianLightColor;
  editable: boolean;
}>`
  width: 1rem;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: "white";
  transform: ${({ orientation }) =>
    orientation === "horizontal" ? "rotate(0deg)" : "rotate(0deg)"};
  cursor: ${({ editable }) => (editable ? "pointer" : "default")};
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
  signals,
}) => {
  const { allowConflictingConfig } = useAppSelector(
    (state) => state.signalConfig
  );
  const [signalColors, setSignalColors] = useState({
    left,
    straight,
    right,
    bike,
    pedestrian,
  });

  useEffect(() => {
    setSignalColors({
      left,
      straight,
      right,
      bike,
      pedestrian,
    });
  }, [left, straight, right, bike, pedestrian]);

  // Toggle only between Red and Green on click
  const handleSignalClick = (signalType: string) => {
    if (!editable) return;

    const currentColor = signalColors[signalType as keyof typeof signalColors];
    const newColor = currentColor === "R" ? "G" : "R";

    // Check for conflicts
    let conflicts: string[] = [];
    if (allowConflictingConfig === false) {
      conflicts = checkForConflicts(direction, signalType, newColor, signals);
    }

    if (conflicts.length > 0) {
      emitToastMessage(conflicts.join(" "), "error");
      return;
    }

    // No conflicts, update the signal color
    onSignalClick(direction, signalType, newColor);

    setSignalColors((prevColors) => ({
      ...prevColors,
      [signalType]: newColor,
    }));
  };

  return (
    <SignalWrapper orientation={orientation} $position={position}>
      <SignalGroup orientation={orientation}>
        {direction === "N" || direction === "E" ? (
          <>
            <div
              style={{
                position: "absolute",
                top: pedestrianPosition.first.top,
                left: pedestrianPosition.first.left,
                color: "white",
                backgroundColor:
                  pedestrian === "R"
                    ? "red"
                    : pedestrian === "G"
                    ? "green"
                    : "grey",
                padding: ".4rem",
                borderRadius: "50%",
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                orientation={orientation}
                editable={editable}
                onClick={() => handleSignalClick("pedestrian")}
              >
                {/* <ImManWoman fontSize={20} /> */}
                {direction}
              </PedestrianSignalLight>
            </div>
            <div
              style={{
                position: "absolute",
                top: pedestrianPosition.second.top,
                left: pedestrianPosition.second.left,
                color: "white",
                backgroundColor:
                  pedestrian === "R"
                    ? "red"
                    : pedestrian === "G"
                    ? "green"
                    : "grey",
                padding: ".4rem",
                borderRadius: "50%",
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                orientation={orientation}
                editable={editable}
                onClick={() => handleSignalClick("pedestrian")}
              >
                {/* <ImManWoman fontSize={20} /> */}
                {direction}
              </PedestrianSignalLight>
            </div>
            <SignalLight
              color={signalColors.bike}
              editable={editable}
              onClick={() => handleSignalClick("bike")}
            />
            <SignalLight
              color={signalColors.right}
              editable={editable}
              onClick={() => handleSignalClick("right")}
            />
            <SignalLight
              color={signalColors.straight}
              editable={editable}
              onClick={() => handleSignalClick("straight")}
            />
            <SignalLight
              color={signalColors.left}
              editable={editable}
              onClick={() => handleSignalClick("left")}
            />
          </>
        ) : (
          <>
            <SignalLight
              color={signalColors.left}
              editable={editable}
              onClick={() => handleSignalClick("left")}
            />
            <SignalLight
              color={signalColors.straight}
              editable={editable}
              onClick={() => handleSignalClick("straight")}
            />
            <SignalLight
              color={signalColors.right}
              editable={editable}
              onClick={() => handleSignalClick("right")}
            />
            <SignalLight
              color={signalColors.bike}
              editable={editable}
              onClick={() => handleSignalClick("bike")}
            />
            <div
              style={{
                position: "absolute",
                top: pedestrianPosition.first.top,
                left: pedestrianPosition.first.left,
                color: "white",
                backgroundColor:
                  pedestrian === "R"
                    ? "red"
                    : pedestrian === "G"
                    ? "green"
                    : "grey",
                padding: ".4rem",
                borderRadius: "50%",
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                orientation={orientation}
                editable={editable}
                onClick={() => handleSignalClick("pedestrian")}
              >
                {/* <ImManWoman size={20} /> */}
                {direction}
              </PedestrianSignalLight>
            </div>
            <div
              style={{
                position: "absolute",
                top: pedestrianPosition.second.top,
                left: pedestrianPosition.second.left,
                color: "white",
                backgroundColor:
                  pedestrian === "R"
                    ? "red"
                    : pedestrian === "G"
                    ? "green"
                    : "grey",
                padding: ".4rem",
                borderRadius: "50%",
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                orientation={orientation}
                editable={editable}
                onClick={() => handleSignalClick("pedestrian")}
              >
                {/* <ImManWoman size={20} /> */}
                {direction}
              </PedestrianSignalLight>
            </div>
          </>
        )}
      </SignalGroup>
    </SignalWrapper>
  );
};

export default TrafficSignal;
