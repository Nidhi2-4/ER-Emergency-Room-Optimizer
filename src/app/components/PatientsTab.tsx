import { useState } from "react";
import { Patient } from "../types";

interface Props {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
}

type PatientStatus = "Critical" | "Moderate" | "Stable";

export function PatientsTab({ patients, setPatients }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<Patient | null>(null);

  const [newPatient, setNewPatient] = useState({
    name: "",
    injury: "",
    severity: 50,
    treatmentTime: 30,
    status: "Stable" as PatientStatus,
  });

  const getStatusColor = (status: PatientStatus) => {
    switch (status) {
      case "Critical":
        return { bg: "#FEE2E2", text: "#DC2626" };
      case "Moderate":
        return { bg: "#FEF3C7", text: "#D97706" };
      case "Stable":
        return { bg: "#D1FAE5", text: "#16A34A" };
    }
  };

  const handleSearch = () => {
    const result = patients.find((patient) =>
      patient.name.toLowerCase().includes(searchName.toLowerCase())
    );

    setSearchResult(result || null);
  };

  const handleAddPatient = () => {
    const maxId = Math.max(
      ...patients.map((p) => parseInt(p.id.split("-")[1]))
    );

    const newPatientData: Patient = {
      id: `P-${maxId + 1}`,
      name: newPatient.name,
      injury: newPatient.injury,
      severity: newPatient.severity,
      treatmentTime: newPatient.treatmentTime,
      status: newPatient.status,
      rank: patients.length + 1,
    };

    const updatedPatients = [...patients, newPatientData].sort(
      (a, b) => b.severity - a.severity
    );

    updatedPatients.forEach((p, i) => {
      p.rank = i + 1;
    });

    setPatients(updatedPatients);
    setShowAddModal(false);

    setNewPatient({
      name: "",
      injury: "",
      severity: 50,
      treatmentTime: 30,
      status: "Stable",
    });
  };

  const handleDeletePatient = (id: string) => {
    const updatedPatients = patients.filter((p) => p.id !== id);

    updatedPatients.forEach((p, i) => {
      p.rank = i + 1;
    });

    setPatients(updatedPatients);
  };

  return (
    <div>
      {/* Search Section */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search patient by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1"
          />

          <button
            onClick={handleSearch}
            className="bg-[#2563EB] text-white px-5 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {searchResult && (
          <div className="mt-4 border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div className="font-semibold text-blue-800 mb-2">
              Search Result
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>ID: {searchResult.id}</div>
              <div>Name: {searchResult.name}</div>
              <div>Severity: {searchResult.severity}</div>
              <div>Status: {searchResult.status}</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {patients.length} Patients Sorted by Criticality
          </h2>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg"
          >
            + Add Patient
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Rank</th>
                <th className="px-4 py-3 text-left">Patient ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Injury</th>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {patients.map((patient, index) => {
                const statusColor = getStatusColor(patient.status);

                return (
                  <tr
                    key={patient.id}
                    className={`hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    }`}
                  >
                    <td className="px-4 py-4">{patient.rank}</td>
                    <td className="px-4 py-4">{patient.id}</td>
                    <td className="px-4 py-4">{patient.name}</td>
                    <td className="px-4 py-4">{patient.injury}</td>
                    <td className="px-4 py-4">{patient.severity}</td>
                    <td className="px-4 py-4">
                      {patient.treatmentTime} min
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="mb-4 text-lg font-semibold">Add Patient</h2>

            <input
              type="text"
              placeholder="Name"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="text"
              placeholder="Injury"
              value={newPatient.injury}
              onChange={(e) =>
                setNewPatient({ ...newPatient, injury: e.target.value })
              }
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Severity"
              value={newPatient.severity}
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  severity: parseInt(e.target.value),
                })
              }
              className="w-full mb-3 border p-2 rounded"
            />

            <input
              type="number"
              placeholder="Treatment Time"
              value={newPatient.treatmentTime}
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  treatmentTime: parseInt(e.target.value),
                })
              }
              className="w-full mb-3 border p-2 rounded"
            />

            <select
              value={newPatient.status}
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  status: e.target.value as PatientStatus,
                })
              }
              className="w-full mb-3 border p-2 rounded"
            >
              <option value="Critical">Critical</option>
              <option value="Moderate">Moderate</option>
              <option value="Stable">Stable</option>
            </select>

            <div className="flex gap-3">
              <button
                onClick={handleAddPatient}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Add
              </button>

              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 py-2 rounded"
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