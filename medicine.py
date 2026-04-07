import json
import os

# ─────────────────────────────────────────────
#  DATA — Hospital medicine stock
# ─────────────────────────────────────────────

MEDICINES = {
    "Morphine":        {"stock": 50,  "unit": "vials"},
    "Epinephrine":     {"stock": 80,  "unit": "doses"},
    "Antibiotics":     {"stock": 200, "unit": "doses"},
    "Blood Type O+":   {"stock": 15,  "unit": "units"},
    "Blood Type A+":   {"stock": 8,   "unit": "units"},
    "Anesthesia":      {"stock": 100, "unit": "doses"},
    "Saline Solution": {"stock": 300, "unit": "bags"},
    "Insulin":         {"stock": 45,  "unit": "vials"},
    "Anticoagulants":  {"stock": 30,  "unit": "doses"},
    "Pain Relievers":  {"stock": 150, "unit": "doses"},
}

# 10 patients each needing a combination of medicines
# Format: {medicine_name: amount_needed}
PATIENT_NEEDS = [
    {"patientId": "P-2041", "patientName": "Rajesh Kumar",    "needs": {"Epinephrine": 10, "Morphine": 8,  "Anticoagulants": 5}},
    {"patientId": "P-2042", "patientName": "Priya Sharma",    "needs": {"Morphine": 6,  "Saline Solution": 20, "Antibiotics": 15}},
    {"patientId": "P-2043", "patientName": "Amit Patel",      "needs": {"Morphine": 5,  "Antibiotics": 20, "Pain Relievers": 10}},
    {"patientId": "P-2044", "patientName": "Sneha Reddy",     "needs": {"Blood Type O+": 4, "Saline Solution": 15, "Antibiotics": 10}},
    {"patientId": "P-2045", "patientName": "Vikram Singh",    "needs": {"Morphine": 8,  "Anesthesia": 10, "Saline Solution": 10}},
    {"patientId": "P-2046", "patientName": "Kavita Gupta",    "needs": {"Morphine": 6,  "Antibiotics": 25, "Saline Solution": 10}},
    {"patientId": "P-2047", "patientName": "Arjun Nair",      "needs": {"Epinephrine": 5, "Saline Solution": 8,  "Antibiotics": 10}},
    {"patientId": "P-2048", "patientName": "Divya Menon",     "needs": {"Morphine": 4,  "Pain Relievers": 12, "Antibiotics": 8}},
    {"patientId": "P-2049", "patientName": "Rahul Desai",     "needs": {"Antibiotics": 10, "Pain Relievers": 8, "Saline Solution": 5}},
    {"patientId": "P-2050", "patientName": "Anjali Verma",    "needs": {"Insulin": 12, "Saline Solution": 6,  "Pain Relievers": 5}},
]


# ─────────────────────────────────────────────
#  ALGORITHM — Backtracking
#  Try to treat each patient fully.
#  If stock runs out mid-patient, backtrack:
#  undo that patient's consumption and skip them.
# ─────────────────────────────────────────────

def can_treat(patient_needs, current_stock):
    """Check if ALL medicines for this patient are available."""
    for medicine, amount in patient_needs.items():
        if current_stock.get(medicine, 0) < amount:
            return False
    return True


def apply_treatment(patient_needs, stock):
    """Deduct medicines from stock."""
    for medicine, amount in patient_needs.items():
        stock[medicine] -= amount


def undo_treatment(patient_needs, stock):
    """Restore medicines to stock (backtrack)."""
    for medicine, amount in patient_needs.items():
        stock[medicine] += amount


def backtrack(patients, index, stock, treated, untreated):
    """
    Recursively try to treat each patient.
    If a patient can be treated → treat them and continue.
    If not → skip (backtrack) and try the next one.
    """
    if index == len(patients):
        return  # Base case: all patients processed

    patient = patients[index]
    needs   = patient["needs"]

    if can_treat(needs, stock):
        # Treat this patient
        apply_treatment(needs, stock)
        treated.append({
            "patientId":   patient["patientId"],
            "patientName": patient["patientName"],
            "medicines":   [f"{amt} {stock_info_unit(m)} of {m}" 
                            for m, amt in needs.items()],
        })
        backtrack(patients, index + 1, stock, treated, untreated)
    else:
        # Cannot treat — find out what's missing and backtrack
        missing = []
        for medicine, amount in needs.items():
            available = stock.get(medicine, 0)
            if available < amount:
                missing.append(f"{medicine} (need {amount}, have {available})")

        untreated.append({
            "patientId":   patient["patientId"],
            "patientName": patient["patientName"],
            "missing":     missing,
        })
        # Backtrack: skip this patient, try next
        backtrack(patients, index + 1, stock, treated, untreated)


def stock_info_unit(medicine_name):
    return MEDICINES.get(medicine_name, {}).get("unit", "units")


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

def run():
    # Working copy of stock
    current_stock = {name: info["stock"] for name, info in MEDICINES.items()}

    treated   = []
    untreated = []

    backtrack(PATIENT_NEEDS, 0, current_stock, treated, untreated)

    print(f"[Backtracking] Fully treated: {len(treated)} patients")
    print(f"[Backtracking] Cannot treat:  {len(untreated)} patients")

    # Build medicine summary (for MedicineTab)
    medicine_list = []
    total_required = {name: 0 for name in MEDICINES}
    for p in PATIENT_NEEDS:
        for med, amt in p["needs"].items():
            total_required[med] = total_required.get(med, 0) + amt

    for i, (name, info) in enumerate(MEDICINES.items(), start=1):
        medicine_list.append({
            "id":       f"M-{i:03d}",
            "name":     name,
            "stock":    info["stock"],
            "required": total_required.get(name, 0),
            "unit":     info["unit"],
        })

    result = {
        "medicines": medicine_list,
        "treated":   treated,
        "untreated": untreated,
    }

    os.makedirs("public/data", exist_ok=True)
    with open("public/data/medicine.json", "w") as f:
        json.dump(result, f, indent=2)

    print("Saved → public/data/medicine.json")
    return result


if __name__ == "__main__":
    run()
