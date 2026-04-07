import { useState } from 'react';
import { Patient } from '../types';

interface Props {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
}

export function PatientsTab({ patients, setPatients }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    injury: '',
    severity: 50,
    treatmentTime: 30,
    status: 'Stable' as const,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const handleAddPatient = () => {
    const maxId = Math.max(...patients.map(p => parseInt(p.id.split('-')[1])));
    const newId = `P-${maxId + 1}`;
    const newRank = patients.length + 1;

    const patient: Patient = {
      id: newId,
      name: newPatient.name,
      injury: newPatient.injury,
      severity: newPatient.severity,
      treatmentTime: newPatient.treatmentTime,
      status: newPatient.status,
      rank: newRank,
    };

    const updatedPatients = [...patients, patient].sort((a, b) => b.severity - a.severity);
    updatedPatients.forEach((p, i) => {
      p.rank = i + 1;
    });

    setPatients(updatedPatients);
    setShowAddModal(false);
    setNewPatient({ name: '', injury: '', severity: 50, treatmentTime: 30, status: 'Stable' });
  };

  const handleDeletePatient = (id: string) => {
    const updatedPatients = patients.filter(p => p.id !== id);
    updatedPatients.forEach((p, i) => {
      p.rank = i + 1;
    });
    setPatients(updatedPatients);
  };

  return (
    <div>
      <div
        className="bg-white rounded-lg p-6"
        style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-900">{patients.length} Patients Sorted by Criticality</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg"
          >
            + Add Patient
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600">Rank</th>
                <th className="text-left py-3 px-4 text-gray-600">Patient ID</th>
                <th className="text-left py-3 px-4 text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-gray-600">Injury Type</th>
                <th className="text-left py-3 px-4 text-gray-600">Severity Score</th>
                <th className="text-left py-3 px-4 text-gray-600">Treatment Time</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => {
                const statusColor = getStatusColor(patient.status);
                return (
                  <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{patient.rank}</td>
                    <td className="py-3 px-4 text-gray-900">{patient.id}</td>
                    <td className="py-3 px-4 text-gray-900">{patient.name}</td>
                    <td className="py-3 px-4 text-gray-600">{patient.injury}</td>
                    <td className="py-3 px-4 text-gray-900">{patient.severity}</td>
                    <td className="py-3 px-4 text-gray-600">{patient.treatmentTime} min</td>
                    <td className="py-3 px-4">
                      <span
                        className="px-3 py-1 rounded-full inline-block"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="mb-6 text-gray-900">Add New Patient</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Patient Name</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Injury Type</label>
                <input
                  type="text"
                  value={newPatient.injury}
                  onChange={(e) => setNewPatient({ ...newPatient, injury: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter injury type"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Severity Score (1-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newPatient.severity}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, severity: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Treatment Time (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={newPatient.treatmentTime}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, treatmentTime: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  value={newPatient.status}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      status: e.target.value as 'Critical' | 'Moderate' | 'Stable',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Critical">Critical</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Stable">Stable</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddPatient}
                className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg"
              >
                Add Patient
              </button>
              <button
                onClick={() => setShowAddModal(false)}
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
