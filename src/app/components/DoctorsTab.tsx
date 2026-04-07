import { useState } from 'react';
import { Doctor, Patient } from '../types';

interface Props {
  doctors: Doctor[];
  setDoctors: (doctors: Doctor[]) => void;
  patients: Patient[];
}

export function DoctorsTab({ doctors, setDoctors, patients }: Props) {
  const [editingDoctor, setEditingDoctor] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<string>('');

  const getSpecializationColor = (spec: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Cardiology: { bg: '#DBEAFE', text: '#2563EB' },
      Neurology: { bg: '#F3E8FF', text: '#9333EA' },
      Orthopedics: { bg: '#FEF3C7', text: '#D97706' },
      'General Surgery': { bg: '#D1FAE5', text: '#16A34A' },
      'Emergency Medicine': { bg: '#FEE2E2', text: '#DC2626' },
      Anesthesiology: { bg: '#E0E7FF', text: '#4F46E5' },
      'Trauma Surgery': { bg: '#FCE7F3', text: '#DB2777' },
      Pediatrics: { bg: '#FFEDD5', text: '#EA580C' },
    };
    return colors[spec] || { bg: '#F3F4F6', text: '#6B7280' };
  };

  const handleAssignCase = (doctorId: string) => {
    if (!selectedPatient) return;

    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const updatedDoctors = doctors.map(d =>
      d.id === doctorId
        ? {
            ...d,
            status: 'busy' as const,
            assignedCase: `${patient.id} - ${patient.injury}`,
          }
        : d
    );

    setDoctors(updatedDoctors);
    setEditingDoctor(null);
    setSelectedPatient('');
  };

  const handleUnassign = (doctorId: string) => {
    const updatedDoctors = doctors.map(d =>
      d.id === doctorId
        ? { ...d, status: 'available' as const, assignedCase: null }
        : d
    );
    setDoctors(updatedDoctors);
  };

  return (
    <div>
      <div
        className="bg-white rounded-lg p-6 mb-6"
        style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
      >
        <h2 className="mb-4 text-gray-900">Doctor Availability</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#16A34A]" />
            <span className="text-gray-600">
              Available: {doctors.filter(d => d.status === 'available').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#DC2626]" />
            <span className="text-gray-600">
              Busy: {doctors.filter(d => d.status === 'busy').length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => {
          const specColor = getSpecializationColor(doctor.specialization);
          const isEditing = editingDoctor === doctor.id;

          return (
            <div
              key={doctor.id}
              className="bg-white rounded-lg p-6"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  {doctor.name
                    .split(' ')
                    .slice(1)
                    .map(n => n[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">{doctor.name}</div>
                  <span
                    className="px-2 py-1 rounded-full inline-block"
                    style={{
                      backgroundColor: specColor.bg,
                      color: specColor.text,
                      fontSize: '0.75rem',
                    }}
                  >
                    {doctor.specialization}
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    doctor.status === 'available' ? 'bg-[#16A34A]' : 'bg-[#DC2626]'
                  }`}
                />
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select patient</option>
                    {patients
                      .filter(p => p.status === 'Critical' || p.status === 'Moderate')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.id} - {p.name}
                        </option>
                      ))}
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAssignCase(doctor.id)}
                      className="flex-1 px-3 py-2 bg-[#2563EB] text-white rounded-lg"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => {
                        setEditingDoctor(null);
                        setSelectedPatient('');
                      }}
                      className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {doctor.assignedCase ? (
                    <div>
                      <div className="text-gray-600 mb-2">Assigned Case:</div>
                      <div className="text-gray-900 mb-3">{doctor.assignedCase}</div>
                      <button
                        onClick={() => handleUnassign(doctor.id)}
                        className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-lg"
                      >
                        Unassign
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-gray-400 mb-3">No case assigned</div>
                      <button
                        onClick={() => setEditingDoctor(doctor.id)}
                        className="w-full px-3 py-2 bg-[#2563EB] text-white rounded-lg"
                      >
                        Assign Case
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
