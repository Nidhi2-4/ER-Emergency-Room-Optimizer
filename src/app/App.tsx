import { useEffect, useState } from "react";
import { PatientsTab } from "./components/PatientsTab";
import { OTScheduleTab } from "./components/OTScheduleTab";
import { DoctorsTab } from "./components/DoctorsTab";
import { MedicineTab } from "./components/MedicineTab";
import { WardsTab } from "./components/WardsTab";
import { Patient, Doctor, Medicine, Ward, OTRoom } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("patients");

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [wings, setWings] = useState<Ward[]>([]);
  const [otRooms, setOtRooms] = useState<OTRoom[]>([]);

  useEffect(() => {
    fetch("/data/patients.json")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error("Error loading patients:", err));

    fetch("/data/doctors.json")
      .then((res) => res.json())
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Error loading doctors:", err));

    fetch("/data/medicine.json")
      .then((res) => res.json())
      .then((data) => setMedicines(data.medicines))
      .catch((err) => console.error("Error loading medicines:", err));

    fetch("/data/wards.json")
      .then((res) => res.json())
      .then((data) => setWings(data))
      .catch((err) => console.error("Error loading wards:", err));

    fetch("/data/ot.json")
      .then((res) => res.json())
      .then((data) => setOtRooms(data))
      .catch((err) => console.error("Error loading OT rooms:", err));
  }, []);

  const runSimulation = () => {
    window.location.reload();
  };

  const tabs = [
    { id: "patients", label: "Patients" },
    { id: "ot-schedule", label: "OT Schedule" },
    { id: "doctors", label: "Doctors" },
    { id: "medicine", label: "Medicine" },
    { id: "wards", label: "Wards" },
  ];

  return (
    <div style={{ backgroundColor: "#F0F4F8", minHeight: "100vh" }}>
      {/* Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="13" y="4" width="6" height="24" fill="#DC2626" rx="1" />
              <rect x="4" y="13" width="24" height="6" fill="#DC2626" rx="1" />
            </svg>
          </div>

          <h1 className="text-gray-900 text-xl font-semibold">
            ER — Emergency Room Optimizer
          </h1>

          <button
            className="px-6 py-2 bg-[#2563EB] text-white rounded-lg flex items-center gap-2"
            onClick={runSimulation}
          >
            <span>▶</span>
            <span>Run Simulation</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-[#2563EB] text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "patients" && (
          <PatientsTab patients={patients} setPatients={setPatients} />
        )}

        {activeTab === "ot-schedule" && (
          <OTScheduleTab
            otRooms={otRooms}
            setOtRooms={setOtRooms}
            patients={patients}
          />
        )}

        {activeTab === "doctors" && (
          <DoctorsTab
            doctors={doctors}
            setDoctors={setDoctors}
            patients={patients}
          />
        )}

        {activeTab === "medicine" && (
          <MedicineTab
            medicines={medicines}
            setMedicines={setMedicines}
          />
        )}

        {activeTab === "wards" && (
          <WardsTab
            wings={wings}
            setWings={setWings}
            patients={patients}
          />
        )}
      </div>
    </div>
  );
}