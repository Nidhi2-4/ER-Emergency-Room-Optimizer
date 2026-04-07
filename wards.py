import json
import os

# ─────────────────────────────────────────────
#  DATA — 20 patients to distribute across wings
# ─────────────────────────────────────────────

ALL_PATIENTS = [
    {"id": "P-2041", "name": "Rajesh Kumar",    "status": "Critical"},
    {"id": "P-2042", "name": "Priya Sharma",    "status": "Critical"},
    {"id": "P-2043", "name": "Amit Patel",      "status": "Critical"},
    {"id": "P-2044", "name": "Sneha Reddy",     "status": "Critical"},
    {"id": "P-2045", "name": "Vikram Singh",    "status": "Critical"},
    {"id": "P-2046", "name": "Kavita Gupta",    "status": "Moderate"},
    {"id": "P-2047", "name": "Arjun Nair",      "status": "Moderate"},
    {"id": "P-2048", "name": "Divya Menon",     "status": "Moderate"},
    {"id": "P-2049", "name": "Rahul Desai",     "status": "Moderate"},
    {"id": "P-2050", "name": "Anjali Verma",    "status": "Moderate"},
    {"id": "P-2051", "name": "Sanjay Iyer",     "status": "Stable"},
    {"id": "P-2052", "name": "Pooja Kapoor",    "status": "Stable"},
    {"id": "P-2053", "name": "Karan Mehta",     "status": "Stable"},
    {"id": "P-2054", "name": "Neha Joshi",      "status": "Stable"},
    {"id": "P-2055", "name": "Manish Rao",      "status": "Stable"},
    {"id": "P-2056", "name": "Simran Kaur",     "status": "Stable"},
    {"id": "P-2057", "name": "Aditya Shah",     "status": "Stable"},
    {"id": "P-2058", "name": "Ritu Bansal",     "status": "Stable"},
    {"id": "P-2059", "name": "Deepak Malhotra", "status": "Stable"},
    {"id": "P-2060", "name": "Swati Agarwal",   "status": "Stable"},
]

WING_CAPACITY = 15

# Priority weights for optimizing each wing
STATUS_WEIGHT = {"Critical": 3, "Moderate": 2, "Stable": 1}


# ─────────────────────────────────────────────
#  ALGORITHM — Divide & Conquer
#
#  Step 1 — DIVIDE: Split patients into two halves
#  Step 2 — CONQUER: Optimize each half independently
#            (sort by status priority within each half)
#  Step 3 — MERGE: Assign optimized halves to Wing A & B
# ─────────────────────────────────────────────

def optimize_wing(patients):
    """
    Conquer step: Sort patients within a wing by status priority.
    Critical patients get highest priority beds.
    """
    return sorted(patients, key=lambda p: STATUS_WEIGHT[p["status"]], reverse=True)


def divide_and_conquer_wards(all_patients, wing_a_capacity, wing_b_capacity):
    """
    Divide patients into two groups, optimize each, then merge into final plan.
    """
    n   = len(all_patients)
    mid = n // 2

    # ── DIVIDE ──
    left_half  = all_patients[:mid]   # first 10 patients
    right_half = all_patients[mid:]   # last 10 patients

    print(f"[Divide] Split {n} patients → Left: {len(left_half)}, Right: {len(right_half)}")

    # ── CONQUER: optimize each half independently ──
    wing_b_patients = optimize_wing(left_half)   # Critical/high priority → Wing B (ICU)
    wing_a_patients = optimize_wing(right_half)  # Stable/lower priority  → Wing A

    print(f"[Conquer] Wing B optimized: {[p['status'] for p in wing_b_patients]}")
    print(f"[Conquer] Wing A optimized: {[p['status'] for p in wing_a_patients]}")

    # ── MERGE: build final bed assignments ──
    wing_b = build_wing("Wing B", "B", "20", wing_b_patients, wing_b_capacity)
    wing_a = build_wing("Wing A", "A", "10", wing_a_patients, wing_a_capacity)

    return [wing_a, wing_b]


def build_wing(wing_name, prefix, bed_code, patients, capacity):
    """Assign bed numbers and format wing data."""
    bed_patients = []
    for i, patient in enumerate(patients[:capacity], start=1):
        bed_patients.append({
            "bed":         f"{prefix}-{bed_code}{i}",
            "patientId":   patient["id"],
            "patientName": patient["name"],
            "condition":   patient["status"],
        })

    wing_id = "wing-a" if prefix == "A" else "wing-b"
    return {
        "id":       wing_id,
        "name":     wing_name,
        "capacity": capacity,
        "patients": bed_patients,
    }


# ─────────────────────────────────────────────
#  MAIN
# ─────────────────────────────────────────────

def run():
    wings = divide_and_conquer_wards(
        ALL_PATIENTS,
        wing_a_capacity=WING_CAPACITY,
        wing_b_capacity=WING_CAPACITY,
    )

    for wing in wings:
        critical = sum(1 for p in wing["patients"] if p["condition"] == "Critical")
        moderate = sum(1 for p in wing["patients"] if p["condition"] == "Moderate")
        stable   = sum(1 for p in wing["patients"] if p["condition"] == "Stable")
        print(f"[Merge] {wing['name']}: {len(wing['patients'])}/{wing['capacity']} beds | "
              f"Critical={critical}, Moderate={moderate}, Stable={stable}")

    os.makedirs("public/data", exist_ok=True)
    with open("public/data/wards.json", "w") as f:
        json.dump(wings, f, indent=2)

    print("Saved → public/data/wards.json")
    return wings


if __name__ == "__main__":
    run()