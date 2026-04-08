import json
import random

# ─────────────────────────────────────────────
#  DATA — 20 patients with realistic ER cases
# ─────────────────────────────────────────────

RAW_PATIENTS = [
    {"id": "P-2041", "name": "Rajesh Kumar",    "injury": "Cardiac Arrest",      "severity": 95, "treatmentTime": 180},
    {"id": "P-2042", "name": "Priya Sharma",    "injury": "Head Trauma",          "severity": 92, "treatmentTime": 240},
    {"id": "P-2043", "name": "Amit Patel",      "injury": "Multiple Fractures",   "severity": 88, "treatmentTime": 150},
    {"id": "P-2044", "name": "Sneha Reddy",     "injury": "Internal Bleeding",    "severity": 90, "treatmentTime": 200},
    {"id": "P-2045", "name": "Vikram Singh",    "injury": "Spinal Injury",        "severity": 85, "treatmentTime": 300},
    {"id": "P-2046", "name": "Kavita Gupta",    "injury": "Severe Burns",         "severity": 80, "treatmentTime": 180},
    {"id": "P-2047", "name": "Arjun Nair",      "injury": "Pneumothorax",         "severity": 75, "treatmentTime": 120},
    {"id": "P-2048", "name": "Divya Menon",     "injury": "Fracture - Femur",     "severity": 70, "treatmentTime": 90},
    {"id": "P-2049", "name": "Rahul Desai",     "injury": "Deep Laceration",      "severity": 65, "treatmentTime": 60},
    {"id": "P-2050", "name": "Anjali Verma",    "injury": "Concussion",           "severity": 60, "treatmentTime": 45},
    {"id": "P-2051", "name": "Sanjay Iyer",     "injury": "Broken Arm",           "severity": 50, "treatmentTime": 60},
    {"id": "P-2052", "name": "Pooja Kapoor",    "injury": "Minor Burns",          "severity": 45, "treatmentTime": 30},
    {"id": "P-2053", "name": "Karan Mehta",     "injury": "Sprained Ankle",       "severity": 40, "treatmentTime": 20},
    {"id": "P-2054", "name": "Neha Joshi",      "injury": "Cuts & Bruises",       "severity": 35, "treatmentTime": 15},
    {"id": "P-2055", "name": "Manish Rao",      "injury": "Allergic Reaction",    "severity": 30, "treatmentTime": 25},
    {"id": "P-2056", "name": "Simran Kaur",     "injury": "Mild Chest Pain",      "severity": 28, "treatmentTime": 30},
    {"id": "P-2057", "name": "Aditya Shah",     "injury": "Dehydration",          "severity": 25, "treatmentTime": 20},
    {"id": "P-2058", "name": "Ritu Bansal",     "injury": "Food Poisoning",       "severity": 22, "treatmentTime": 30},
    {"id": "P-2059", "name": "Deepak Malhotra", "injury": "Minor Abrasion",       "severity": 18, "treatmentTime": 10},
    {"id": "P-2060", "name": "Swati Agarwal",   "injury": "Headache",             "severity": 15, "treatmentTime": 15},
]


# ─────────────────────────────────────────────
#  ALGORITHM 1 — Merge Sort (by severity DESC)
# ─────────────────────────────────────────────

def merge_sort(patients):
    """Sort patients by severity score in descending order."""
    if len(patients) <= 1:
        return patients

    mid = len(patients) // 2
    left  = merge_sort(patients[:mid])
    right = merge_sort(patients[mid:])
    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        # Descending: higher severity first
        if left[i]["severity"] >= right[j]["severity"]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result


# ─────────────────────────────────────────────
#  ALGORITHM 2 — Binary Search (find by rank)
# ─────────────────────────────────────────────

def binary_search_by_rank(sorted_patients, target_rank):
    """
    Since patients are sorted by severity (rank = index+1),
    binary search finds the patient at a given rank instantly.
    """
    lo, hi = 0, len(sorted_patients) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        current_rank = sorted_patients[mid]["rank"]
        if current_rank == target_rank:
            return sorted_patients[mid]
        elif current_rank < target_rank:
            lo = mid + 1
        else:
            hi = mid - 1
    return None


# ─────────────────────────────────────────────
#  STATUS helper
# ─────────────────────────────────────────────

def get_status(severity):
    if severity >= 75:
        return "Critical"
    elif severity >= 50:
        return "Moderate"
    else:
        return "Stable"


# ─────────────────────────────────────────────
#  MAIN — run, assign ranks, write JSON
# ─────────────────────────────────────────────

def run():
    # Shuffle first to prove merge sort is actually working
    shuffled = RAW_PATIENTS.copy()
    random.shuffle(shuffled)

    sorted_patients = merge_sort(shuffled)

    # Assign rank and status after sort
    result = []
    for i, p in enumerate(sorted_patients):
        patient = {
            "id":            p["id"],
            "name":          p["name"],
            "injury":        p["injury"],
            "severity":      p["severity"],
            "treatmentTime": p["treatmentTime"],
            "status":        get_status(p["severity"]),
            "rank":          i + 1,
        }
        result.append(patient)

    # Demo binary search — find next most critical unattended patient
    next_critical = binary_search_by_rank(result, 1)
    print(f"[Binary Search] Next most critical patient: {next_critical['name']} (Severity: {next_critical['severity']})")

    import os
    os.makedirs("public/data", exist_ok=True)
    with open("public/data/patients.json", "w") as f:
        json.dump(result, f, indent=2)

    print(f"[Merge Sort] Sorted {len(result)} patients by criticality.")
    print("Saved → public/data/patients.json")
    return result

def binary_search_by_name(patients, target_name):
    left = 0
    right = len(patients) - 1

    target_name = target_name.lower()

    while left <= right:
        mid = (left + right) // 2
        mid_name = patients[mid]["name"].lower()

        if mid_name == target_name:
            return patients[mid]
        elif mid_name < target_name:
            left = mid + 1
        else:
            right = mid - 1

    return None
if __name__ == "__main__":
    run()