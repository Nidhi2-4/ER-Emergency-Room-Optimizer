import { useState } from 'react';
import { Ward, Patient } from '../types';

interface Props {
  wings: Ward[];
  setWings: (wings: Ward[]) => void;
  patients: Patient[];
}

export function WardsTab({ wings, setWings, patients }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWing, setSelectedWing] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Critical':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'Moderate':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'Stable':
        return { bg: '#D1FAE5', text: '#16A34A' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const getAvailablePatients = () => {
    const assignedPatientIds = wings.flatMap(w => w.patients.map(p => p.patientId));
    return patients.filter(p => !assignedPatientIds.includes(p.id));
  };

  const handleAddPatient = () => {
    if (!selectedWing || !selectedPatientId) return;

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const updatedWings = wings.map(wing => {
      if (wing.id === selectedWing && wing.patients.length < wing.capacity) {
        const bedNumber = wing.patients.length + 1;
        const bedPrefix = wing.name === 'Wing A' ? 'A' : 'B';
        const bedCode = wing.name === 'Wing A' ? '10' : '20';
        const newBed = `${bedPrefix}-${bedCode}${bedNumber}`;

        return {
          ...wing,
          patients: [
            ...wing.patients,
            {
              bed: newBed,
              patientId: patient.id,
              patientName: patient.name,
              condition: patient.status,
            },
          ],
        };
      }
      return wing;
    });

    setWings(updatedWings);
    setShowAddModal(false);
    setSelectedWing('');
    setSelectedPatientId('');
  };

  const handleRemovePatient = (wingId: string, bed: string) => {
    const updatedWings = wings.map(wing => {
      if (wing.id === wingId) {
        return {
          ...wing,
          patients: wing.patients.filter(p => p.bed !== bed),
        };
      }
      return wing;
    });
    setWings(updatedWings);
  };

  const availablePatients = getAvailablePatients();

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg"
        >
          + Assign Patient to Ward
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wings.map((wing) => (
          <div
            key={wing.id}
            className="bg-white rounded-lg p-6"
            style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
          >
            <h2 className="mb-6 text-gray-900">{wing.name}</h2>
            <div className="space-y-3 mb-6">
              {wing.patients.map((patient) => {
                const conditionColor = getConditionColor(patient.condition);
                return (
                  <div
                    key={patient.bed}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-gray-900">{patient.bed}</div>
                      <div className="text-gray-600">
                        {patient.patientId} - {patient.patientName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: conditionColor.bg,
                          color: conditionColor.text,
                        }}
                      >
                        {patient.condition}
                      </span>
                      <button
                        onClick={() => handleRemovePatient(wing.id, patient.bed)}
                        className="text-red-600 hover:text-red-800 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Occupancy</span>
                <span className="text-gray-900">
                  {wing.patients.length} / {wing.capacity} beds
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="mb-6 text-gray-900">Assign Patient to Ward</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Select Ward</label>
                <select
                  value={selectedWing}
                  onChange={(e) => setSelectedWing(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a ward</option>
                  {wings
                    .filter(w => w.patients.length < w.capacity)
                    .map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.patients.length}/{w.capacity} beds)
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a patient</option>
                  {availablePatients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name} ({p.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddPatient}
                className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg"
                disabled={!selectedWing || !selectedPatientId}
              >
                Assign to Ward
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedWing('');
                  setSelectedPatientId('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
