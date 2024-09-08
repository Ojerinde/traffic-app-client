interface BoxOneProps {}
const BoxOne: React.FC<BoxOneProps> = ({}) => {
  return (
    <div className="boxOne">
      <p>
        To create a phase, configure each signal by toggling the corresponding
        lights. If a potential conflict arises, you will receive a notification.
        If you choose to proceed despite the conflict, you can confirm by
        selecting the checkbox below. <strong>Note:</strong> You are responsible
        for any accidents resulting from the conflict. If the checkbox is
        unchecked at any point, your current configuration will be discarded.
      </p>
      <p>
        Once you have completed the signal configuration, click on the add icon
        at the center of the intersection. You will be prompted to enter a name
        for the phase before submitting.
      </p>
    </div>
  );
};
export default BoxOne;
