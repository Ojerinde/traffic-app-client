"use client";
import React from "react";
import styled from "styled-components";

type Direction = "N" | "E" | "S" | "W";
type LightColor = "R" | "A" | "G";
type BikeAndPedColor = "R" | "G";

interface TrafficSignalProps {
  direction: Direction;
  left: LightColor;
  straight: LightColor;
  right: LightColor;
  bike: BikeAndPedColor;
  pedestrian: BikeAndPedColor;
  position: { top: number; left: number };
  orientation: "horizontal" | "vertical";
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

const SignalLight = styled.div<{ color: LightColor | BikeAndPedColor }>`
  width: 1.6rem;
  height: 1.6rem;
  background-color: ${({ color }) =>
    color === "R" ? "red" : color === "A" ? "orange" : "green"};
  margin: 1px;
  border-radius: 50%;
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
}) => {
  if (direction === "N" || direction === "E")
    return (
      <SignalWrapper orientation={orientation} position={position}>
        <SignalGroup orientation={orientation}>
          <SignalLight color={pedestrian} />
          <SignalLight color={bike} />
          <SignalLight color={right} />
          <SignalLight color={straight} />
          <SignalLight color={left} />
        </SignalGroup>
      </SignalWrapper>
    );
  return (
    <SignalWrapper orientation={orientation} position={position}>
      <SignalGroup orientation={orientation}>
        <SignalLight color={left} />
        <SignalLight color={straight} />
        <SignalLight color={right} />
        <SignalLight color={bike} />
        <SignalLight color={pedestrian} />
      </SignalGroup>
    </SignalWrapper>
  );
};

export default TrafficSignal;
