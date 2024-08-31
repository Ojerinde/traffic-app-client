interface DeviceDetailsProps {
  params: any;
}
const DeviceDetails: React.FC<DeviceDetailsProps> = ({ params }) => {
  console.log("Device ID", params);
  return <div>Rest</div>;
};

export default DeviceDetails;
