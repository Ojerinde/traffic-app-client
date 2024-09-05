interface BicycleLaneProps {
  color: "R" | "A" | "G";
}

const BicycleLane: React.FC<BicycleLaneProps> = ({ color }) => {
  return <div className={`bicycle-lane ${color.toLowerCase()}`}></div>;
};

export default BicycleLane;
