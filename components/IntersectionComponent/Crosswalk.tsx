interface CrosswalkProps {
  isWalking: boolean;
}

const Crosswalk: React.FC<CrosswalkProps> = ({ isWalking }) => {
  return <div className={`crosswalk ${isWalking ? "walk" : "stop"}`}></div>;
};

export default Crosswalk;
