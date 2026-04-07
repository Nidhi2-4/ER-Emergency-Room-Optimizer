import json
import os

# ─────────────────────────────────────────────
#  DATA — 12 surgery candidates
#  Each surgery has: duration (minutes) + survival impact score
#  3 OTs, each with max 480 minutes (8 hours) capacity
# ─────────────────────────────────────────────

SURGERY_CANDIDATES = [
    {"patientId": "P-2041", "patientName": "Rajesh Kumar",  "duration": 180, "survivalScore": 95},
    {"patientId": "P-2042", "patientName": "Priya Sharma",  "duration": 240, "survivalScore": 92},
    {"patientId": "P-2043", "patientName": "Amit Patel",    "duration": 150, "survivalScore": 88},
    {"patientId": "P-2044", "patientName": "Sneha Reddy",   "duration": 200, "survivalScore": 90},
    {"patientId": "P-2045", "patientName": "Vikram Singh",  "duration": 300, "survivalScore": 85},
    {"patientId": "P-2046", "patientName": "Kavita Gupta",  "duration": 180, "survivalScore": 80},
    {"patientId": "P-2047", "patientName": "Arjun Nair",    "duration": 120, "survivalScore": 75},
    {"patientId": "P-2048", "patientName": "Divya Menon",   "duration": 90,  "survivalScore": 70},
    {"patientId": "P-2049", "patientName": "Rahul Desai",   "duration": 60,  "survivalScore": 65},
    {"patientId": "P-2050", "patientName": "Anjali Verma",  "duration": 45,  "survivalScore": 60},
    {"patientId": "P-2051", "patientName": "Sanjay Iyer",   "duration": 60,  "survivalScore": 50},
    {"patientId": "P-2052", "patientName": "Pooja Kapoor",  "duration": 30,  "survivalScore": 45},
]

OT_CAPACITY_MINUTES = 480   # 8 hours per OT
NUM_OT_ROOMS        = 3


# ─────────────────────────────────────────────
#  ALGORITHM — 0/1 Knapsack DP
#  Maximize total survival impact within capacity
# ─────────────────────────────────────────────

def knapsack_01(items, capacity):
    """
    Classic 0/1 Knapsack using bottom-up DP.
    items   : list of dicts with 'duration' (weight) and 'survivalScore' (value)
    capacity: max minutes available
    Returns : list of selected items
    """
    n = len(items)
    # dp[i][w] = max survival score using first i items with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        duration = items[i - 1]["duration"]
        score    = items[i - 1]["survivalScore"]
        for w in range(capacity + 1):
            # Don't take item i
            dp[i][w] = dp[i - 1][w]
            # Take item i if it fits
            if duration <= w:
                take = dp[i - 1][w - duration] + score
                if take > dp[i][w]:
                    dp[i][w] = take

    # Backtrack to find which items were selected
    selected = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(items[i - 1])
            w -= items[i - 1]["duration"]

    return selected[::-1]  # restore original order


# ─────────────────────────────────────────────
#  MAIN — assign surgeries to 3 OT rooms
# ─────────────────────────────────────────────

def run():
    remaining = SURGERY_CANDIDATES.copy()
    ot_rooms  = []

    for ot_num in range(1, NUM_OT_ROOMS + 1):
        if not remaining:
            break

        # Run knapsack on remaining candidates for this OT
        selected = knapsack_01(remaining, OT_CAPACITY_MINUTES)

        ot_rooms.append({
            "id":        f"OT-{ot_num}",
            "name":      f"OT {ot_num}",
            "surgeries": selected,
        })

        # Remove assigned patients from pool
        assigned_ids = {s["patientId"] for s in selected}
        remaining = [p for p in remaining if p["patientId"] not in assigned_ids]

        total_mins  = sum(s["duration"]      for s in selected)
        total_score = sum(s["survivalScore"] for s in selected)
        print(f"[Knapsack] OT {ot_num}: {len(selected)} surgeries | "
              f"{total_mins} min used / {OT_CAPACITY_MINUTES} min | "
              f"Survival impact: {total_score}")

    # Fill remaining OT rooms if any
    while len(ot_rooms) < NUM_OT_ROOMS:
        n = len(ot_rooms) + 1
        ot_rooms.append({"id": f"OT-{n}", "name": f"OT {n}", "surgeries": []})

    grand_total = sum(
        s["survivalScore"]
        for room in ot_rooms
        for s in room["surgeries"]
    )
    print(f"[Knapsack] Total Survival Impact across all OTs: {grand_total} pts")

    os.makedirs("public/data", exist_ok=True)
    with open("public/data/ot.json", "w") as f:
        json.dump(ot_rooms, f, indent=2)

    print("Saved → public/data/ot.json")
    return ot_rooms


if __name__ == "__main__":
    run()