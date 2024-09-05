"use client";
import React from "react";
import { motion } from "framer-motion";

interface PedestrianAnimationProps {
  isWalking: boolean;
}

const PedestrianAnimation: React.FC<PedestrianAnimationProps> = ({
  isWalking,
}) => {
  return (
    <motion.div
      className="pedestrian"
      animate={{ x: isWalking ? 100 : 0 }}
      transition={{ duration: 2 }}
    />
  );
};

export default PedestrianAnimation;
