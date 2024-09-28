interface PhaseData {
  duration: number;
  blinkTimeRedToGreen: number;
  blinkTimeGreenToRed: number;
  amberDurationRedToGreen: number;
  amberDurationGreenToRed: number;
  signalString: string | undefined;
}
export function generatePhaseString(phaseData: PhaseData): string {
  const {
    duration,
    blinkTimeRedToGreen,
    blinkTimeGreenToRed,
    amberDurationRedToGreen,
    amberDurationGreenToRed,
    signalString,
  } = phaseData;

  const result = `*${duration}${signalString}${blinkTimeRedToGreen}${blinkTimeGreenToRed}${amberDurationRedToGreen}${amberDurationGreenToRed}*`;

  return result;
}

export const formatRtcDate = (rtc: string | undefined) => {
  if (!rtc) return "Nill";
  const [day, month, yearTime] = rtc.split("-");
  const [year, time] = yearTime.split(" ");
  return new Date(`${year}-${month}-${day}T${time}`).toLocaleDateString();
};

export const formatRtcTime = (rtc: string | undefined) => {
  if (!rtc) return "Nill";
  const [day, month, yearTime] = rtc.split("-");
  const [year, time] = yearTime.split(" ");
  return new Date(`${year}-${month}-${day}T${time}`).toLocaleTimeString();
};

export const getDeviceStatus = (statuses: any, deviceId: string) => {
  const deviceStatus = statuses.find((status: any) => status.id === deviceId);
  return deviceStatus ? deviceStatus.status : false;
};
