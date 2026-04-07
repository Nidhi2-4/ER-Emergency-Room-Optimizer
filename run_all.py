"""
run_all.py — Master simulation runner
Runs all 5 DAA algorithms and saves JSON output to data/
"""

import os
import patients
import ot_scheduler
import doctors
import medicine
import wards

os.makedirs("public/data", exist_ok=True)

print("=" * 55)
print("  ER OPTIMIZER — Running All 5 Algorithms")
print("=" * 55)

print("\n── Algorithm 1: Patient Arrival (Merge Sort + Binary Search) ──")
patients.run()

print("\n── Algorithm 2: OT Scheduling (0/1 Knapsack DP) ──")
ot_scheduler.run()

print("\n── Algorithm 3: Doctor Assignment (Greedy) ──")
doctors.run()

print("\n── Algorithm 4: Medicine Shortage (Backtracking) ──")
medicine.run()

print("\n── Algorithm 5: Ward Management (Divide & Conquer) ──")
wards.run()

print("\n" + "=" * 55)
print("  All algorithms complete! JSON saved to public/data/")
print("=" * 55)