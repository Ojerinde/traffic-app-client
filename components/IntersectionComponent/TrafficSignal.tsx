import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

type Direction = "N" | "E" | "S" | "W";
type LightColor = "R" | "A" | "G";

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

const PedestrianSignalLight = styled.div<{
  color: LightColor;
}>`
  width: 1.8rem;
  height: 1.8rem;
  background-color: ${({ color }) =>
    color === "R" ? "red" : color === "A" ? "orange" : "green"};
  margin: 1px;
  border-radius: 10%;
  cursor: pointer;
`;

const SignalGroup = styled.div<{ orientation: "horizontal" | "vertical" }>`
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === "horizontal" ? "column" : "row"};
  margin: 0 2px;
`;

const ColorModal = styled.div<{
  top: number;
  left: number;
  direction: Direction;
}>`
  position: absolute;
  top: ${({ top, direction }) =>
    direction === "S"
      ? `${top + 20}px`
      : direction === "N"
      ? `${top - 70}px`
      : `${top}px`};
  left: ${({ left, direction }) =>
    direction === "E"
      ? `${left + 20}px`
      : direction === "W"
      ? `${left - 80}px`
      : `${left}px`};
  background: white;
  width: 10rem;
  height: 5rem;
  padding: 10px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColorSelect = styled.select`
  width: 100%;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [currentSignal, setCurrentSignal] = useState<{
    type: string;
    color: LightColor;
  } | null>(null);
  const [signalColors, setSignalColors] = useState({
    left,
    straight,
    right,
    bike,
    pedestrian,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setModalPosition(null);
        setCurrentSignal(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignalClick = (
    signalType: string,
    color: LightColor,
    e: React.MouseEvent,
    position: { top: number; left: number }
  ) => {
    e.stopPropagation();
    setModalPosition({ top: position.top, left: position.left });
    setCurrentSignal({ type: signalType, color });
    onSignalClick(direction, signalType, color);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newColor = event.target.value as LightColor;
    if (currentSignal) {
      const updatedColors = { ...signalColors, [currentSignal.type]: newColor };
      setSignalColors(updatedColors);
      onSignalClick(direction, currentSignal.type, newColor);
      setModalPosition(null);
      setCurrentSignal(null);
    }
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
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                onClick={(e) =>
                  handleSignalClick(
                    "pedestrian",
                    signalColors.pedestrian,
                    e,
                    position
                  )
                }
              />
            </div>
            <SignalLight
              color={signalColors.bike}
              onClick={(e) =>
                handleSignalClick("bike", signalColors.bike, e, position)
              }
            />
            <SignalLight
              color={signalColors.right}
              onClick={(e) =>
                handleSignalClick("right", signalColors.right, e, position)
              }
            />
            <SignalLight
              color={signalColors.straight}
              onClick={(e) =>
                handleSignalClick(
                  "straight",
                  signalColors.straight,
                  e,
                  position
                )
              }
            />
            <SignalLight
              color={signalColors.left}
              onClick={(e) =>
                handleSignalClick("left", signalColors.left, e, position)
              }
            />
          </>
        ) : (
          <>
            <SignalLight
              color={signalColors.left}
              onClick={(e) =>
                handleSignalClick("left", signalColors.left, e, position)
              }
            />
            <SignalLight
              color={signalColors.straight}
              onClick={(e) =>
                handleSignalClick(
                  "straight",
                  signalColors.straight,
                  e,
                  position
                )
              }
            />
            <SignalLight
              color={signalColors.right}
              onClick={(e) =>
                handleSignalClick("right", signalColors.right, e, position)
              }
            />
            <SignalLight
              color={signalColors.bike}
              onClick={(e) =>
                handleSignalClick("bike", signalColors.bike, e, position)
              }
            />
            <div
              style={{
                position: "absolute",
                top: pedestrianPosition.top,
                left: pedestrianPosition.left,
              }}
            >
              <PedestrianSignalLight
                color={signalColors.pedestrian}
                onClick={(e) =>
                  handleSignalClick(
                    "pedestrian",
                    signalColors.pedestrian,
                    e,
                    position
                  )
                }
              />
            </div>
          </>
        )}
      </SignalGroup>
      {modalPosition && currentSignal && editable && (
        <ColorModal
          top={modalPosition.top}
          left={modalPosition.left}
          direction={direction}
          ref={modalRef}
        >
          <ColorSelect value={currentSignal.color} onChange={handleColorChange}>
            <option value="R">Red</option>
            <option value="A">Amber</option>
            <option value="G">Green</option>
          </ColorSelect>
        </ColorModal>
      )}
    </SignalWrapper>
  );
};

export default TrafficSignal;
