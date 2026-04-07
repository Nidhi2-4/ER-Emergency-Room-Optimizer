import { Medicine } from "../types";

interface Props {
  medicines: Medicine[];
  setMedicines: (medicines: Medicine[]) => void;
}

export function MedicineTab({ medicines = [], setMedicines }: Props) {
  const safeMedicines = Array.isArray(medicines) ? medicines : [];

  const updateMedicine = (
    id: string,
    field: "stock" | "required",
    value: number
  ) => {
    const updated = safeMedicines.map((medicine) =>
      medicine.id === id
        ? { ...medicine, [field]: value }
        : medicine
    );

    setMedicines(updated);
  };

  const shortageMedicines = safeMedicines.filter(
    (medicine) => medicine.stock < medicine.required
  );

  const availableMedicines = safeMedicines.filter(
    (medicine) => medicine.stock >= medicine.required
  );

  const renderCard = (medicine: Medicine, shortage = false) => (
    <div
      key={medicine.id}
      className={`p-4 border-l-4 ${
        shortage ? "border-red-500" : "border-green-500"
      } bg-gray-50 rounded`}
    >
      <div className="text-gray-900 font-medium mb-2">
        {medicine.name}
      </div>

      <div className="mb-2">
        <label className="text-sm text-gray-600">Stock:</label>
        <input
          type="number"
          value={medicine.stock}
          onChange={(e) =>
            updateMedicine(
              medicine.id,
              "stock",
              Number(e.target.value)
            )
          }
          className="ml-2 border rounded px-2 py-1 w-24"
        />
      </div>

      <div className="mb-2">
        <label className="text-sm text-gray-600">Required:</label>
        <input
          type="number"
          value={medicine.required}
          onChange={(e) =>
            updateMedicine(
              medicine.id,
              "required",
              Number(e.target.value)
            )
          }
          className="ml-2 border rounded px-2 py-1 w-24"
        />
      </div>

      <div className="text-sm text-gray-600">
        Unit: {medicine.unit}
      </div>

      {shortage && (
        <div className="text-red-600 text-sm mt-2">
          Short by {medicine.required - medicine.stock}{" "}
          {medicine.unit}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        className="bg-white rounded-lg p-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <h2 className="text-lg font-semibold mb-4">
          Fully Available ✅
        </h2>

        <div className="space-y-4">
          {availableMedicines.map((medicine) =>
            renderCard(medicine, false)
          )}
        </div>
      </div>

      <div
        className="bg-white rounded-lg p-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <h2 className="text-lg font-semibold mb-4">
          Shortage ❌
        </h2>

        <div className="space-y-4">
          {shortageMedicines.map((medicine) =>
            renderCard(medicine, true)
          )}
        </div>
      </div>
    </div>
  );
}