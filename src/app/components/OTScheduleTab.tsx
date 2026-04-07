import { OTRoom, Patient } from '../types';

interface Props {
  otRooms: OTRoom[];
  setOtRooms: (rooms: OTRoom[]) => void;
  patients: Patient[];
}

export function OTScheduleTab({ otRooms }: Props) {
  const totalSurvivalImpact = otRooms.reduce(
    (total, room) => total + room.surgeries.reduce((sum, s) => sum + s.survivalScore, 0),
    0
  );

  return (
    <div>
      <div className="mb-6 bg-white rounded-lg p-4" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div className="text-gray-600">Total Survival Impact</div>
        <div className="text-gray-900">{totalSurvivalImpact} pts</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {otRooms.map((room) => {
          const totalHours = room.surgeries.reduce((sum, s) => sum + s.duration, 0) / 60;
          const maxHours = 12;
          const percentage = (totalHours / maxHours) * 100;

          return (
            <div
              key={room.id}
              className="bg-white rounded-lg p-6"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
            >
              <h3 className="mb-4 text-gray-900">{room.name}</h3>
              <div className="space-y-4 mb-6">
                {room.surgeries.map((surgery, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-900 mb-1">{surgery.patientName}</div>
                    <div className="text-gray-600 mb-1">
                      Duration: {surgery.duration} min
                    </div>
                    <div className="text-[#2563EB]">
                      Survival Score: {surgery.survivalScore}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Hours</span>
                  <span className="text-gray-900">{totalHours.toFixed(1)} / {maxHours} hrs</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#2563EB] h-2 rounded-full"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
