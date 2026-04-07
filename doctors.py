import json
import os

# ─────────────────────────────────────────────
#  DATA — 8 doctors with specializations
# ─────────────────────────────────────────────

DOCTORS = [
    {"id": "D-101", "name": "Dr. Ramesh Kumar",  "specialization": "Cardiology"},
    {"id": "D-102", "name": "Dr. Sunita Rao",    "specialization": "Neurology"},
    {"id": "D-103", "name": "Dr. Ashok Patel",   "specialization": "Orthopedics"},
    {"id": "D-104", "name": "Dr. Meera Reddy",   "specialization": "General Surgery"},
    {"id": "D-105", "name": "Dr. Suresh Nair",   "specialization": "Emergency Medicine"},
    {"id": "D-106", "name": "Dr. Lakshmi Iyer",  "specialization": "Anesthesiology"},
    {"id": "D-107", "name": "Dr. Vijay Singh",   "specialization": "Trauma Surgery"},
    {"id": "D-108", "name": "Dr. Priya Desai",   "specialization": "Pediatrics"},
]

# 15 cases — each has required specialization and severity (for greedy priority)
CASES = [
    {"caseId": "C-001", "patientId": "P-2041", "injury": "Cardiac Arrest",    "required": "Cardiology",        "severity": 95},
    {"caseId": "C-002", "patientId": "P-2042", "injury": "Head Trauma",        "required": "Neurology",         "severity": 92},
    {"caseId": "C-003", "patientId": "P-2044", "injury": "Internal Bleeding",  "required": "General Surgery",   "severity": 90},
    {"caseId": "C-004", "patientId": "P-2043", "injury": "Multiple Fractures", "required": "Orthopedics",       "severity": 88},
    {"caseId": "C-005", "patientId": "P-2045", "injury": "Spinal Injury",      "required": "Trauma Surgery",    "severity": 85},
    {"caseId": "C-006", "patientId": "P-2046", "injury": "Severe Burns",       "required": "General Surgery",   "severity": 80},
    {"caseId": "C-007", "patientId": "P-2047", "injury": "Pneumothorax",       "required": "Emergency Medicine","severity": 75},
    {"caseId": "C-008", "patientId": "P-2048", "injury": "Fracture - Femur",   "required": "Orthopedics",       "severity": 70},
    {"caseId": "C-009", "patientId": "P-2049", "injury": "Deep Laceration",    "required": "General Surgery",   "severity": 65},
    {"caseId": "C-010", "patientId": "P-2050", "injury": "Concussion",         "required": "Neurology",         "severity": 60},
    {"caseId": "C-011", "patientId": "P-2051", "injury": "Broken Arm",         "required": "Orthopedics",       "severity": 50},
    {"caseId": "C-012", "patientId": "P-2052", "injury": "Minor Burns",        "required": "Emergency Medicine","severity": 45},
    {"caseId": "C-013", "patientId": "P-2055", "injury": "Allergic Reaction",  "required": "Emergency Medicine","severity": 30},
    {"caseId": "C-014", "patientId": "P-2058", "injury": "Food Poisoning",     "required": "General Surgery",   "severity": 22},
    {"caseId": "C-015", "patientId": "P-2060", "injury": "Severe Headache",    "required": "Neurology",         "severity": 20},
]


# ─────────────────────────────────────────────
#  ALGORITHM — Greedy Assignment
#  Sort cases by severity (highest first),
#  assign each case to the best available
#  matching doctor instantly.
# ─────────────────────────────────────────────

def greedy_assign(doctors, cases):
    # Sort cases by severity descending — most critical gets assigned first
    sorted_cases = sorted(cases, key=lambda c: c["severity"], reverse=True)

    # Track which doctors are free
    available = {d["id"]: True for d in doctors}
    doc_by_spec = {}
    for d in doctors:
        doc_by_spec.setdefault(d["specialization"], []).append(d["id"])

    # Build result doctor list
    doctor_map = {d["id"]: {
        "id":            d["id"],
        "name":          d["name"],
        "specialization": d["specialization"],
        "status":        "available",
        "assignedCase":  None,
    } for d in doctors}

    unassigned_cases = []

    for case in sorted_cases:
        required_spec = case["required"]
        assigned = False

        # Find first available doctor with matching specialization
        for doc_id in doc_by_spec.get(required_spec, []):
            if available[doc_id]:
                doctor_map[doc_id]["status"]       = "busy"
                doctor_map[doc_id]["assignedCase"] = f"{case['patientId']} - {case['injury']}"
                available[doc_id] = False
                assigned = True
                print(f"[Greedy] Assigned {case['patientId']} ({case['injury']}) → "
                      f"{doctor_map[doc_id]['name']} ({required_spec})")
                break

        if not assigned:
            unassigned_cases.append(case)
            print(f"[Greedy] No available {required_spec} doctor for {case['patientId']} — queued")

    return list(doctor_map.values()), unassigned_cases


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

def run():
    result_doctors, unassigned = greedy_assign(DOCTORS, CASES)

    busy_count      = sum(1 for d in result_doctors if d["status"] == "busy")
    available_count = sum(1 for d in result_doctors if d["status"] == "available")
    print(f"\n[Greedy] Summary: {busy_count} doctors assigned, "
          f"{available_count} available, {len(unassigned)} cases unassigned")

    os.makedirs("public/data", exist_ok=True)
    with open("public/data/doctors.json", "w") as f:
        json.dump(result_doctors, f, indent=2)

    print("Saved → public/data/doctors.json")
    return result_doctors


if __name__ == "__main__":
    run()