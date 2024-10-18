export const getCustomSortingPreset = (isOneToOneCall: boolean = false) => {
  // ... (existing getCustomSortingPreset function)
};

export const RoomEnableToJoin = (room: any) => {
  if (!room?.appointment_date) return false;

  const appointmentDate = new Date(room?.appointment_date);
  const now = new Date();
  return (appointmentDate.getTime() - now.getTime() <= 5 * 60 * 1000);
};

export const hasMeetingStarted = (room: any) => {
  if (room?.appointment_date) {
    const appointmentDate = new Date(room?.appointment_date);
    if (RoomEnableToJoin(room)) {
      return 'A reunião já começou';
    } else {
      return <p>A reunião começa em<p className="text-primary-500 font-bold">{appointmentDate.toLocaleDateString()} às {appointmentDate.toLocaleTimeString()}</p></p>;
    }
  }
};
