"use client";
import React from "react";
import styled from "styled-components";
import TrafficSignal from "./TrafficSignal";

interface SignalState {
  left: "R" | "A" | "G";
  straight: "R" | "A" | "G";
  right: "R" | "A" | "G";
  bike: "R" | "G";
  pedestrian: "R" | "G";
}

interface Signal extends SignalState {
  direction: "N" | "E" | "S" | "W";
  position: { top: number; left: number };
  orientation: "horizontal" | "vertical";
}

interface IntersectionDisplayProps {
  signals: Signal[];
  backgroundImage: string;
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

const IntersectionDisplay: React.FC<IntersectionDisplayProps> = ({
  signals,
  backgroundImage,
}) => {
  return (
    <Background backgroundImage={backgroundImage}>
      {signals.map((signal, index) => (
        <TrafficSignal key={index} {...signal} />
      ))}
    </Background>
  );
};

export default IntersectionDisplay;
