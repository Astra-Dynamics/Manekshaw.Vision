#!/usr/bin/env python3
"""
Manekshaw.Vision E2E Acceptance Test Runner
Executes comprehensive opaque-box tests across all 4 tiers and reports metrics:
- Tier 1: Feature Coverage (F1 through F16)
- Tier 2: Boundary and Corner Cases
- Tier 3: Cross-Feature Combinations (Pairwise Interaction Testing)
- Tier 4: Real-World Application Scenarios
"""

import sys
import os
import time
import json
import argparse
import unittest
from datetime import datetime, timezone
from typing import Dict, Any, List

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Configure stdout encoding safety
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

TIER_MAP = {
    1: {
        "name": "Tier 1: Feature Coverage (F1 - F16)",
        "file": "test_tier1_features.py",
        "description": "Validates all 16 architectural features in isolation (>=5 tests per feature)."
    },
    2: {
        "name": "Tier 2: Boundary & Corner Cases",
        "file": "test_tier2_boundaries.py",
        "description": "Tests extreme inputs, corrupt feeds, malformed XML, and quota thresholds."
    },
    3: {
        "name": "Tier 3: Cross-Feature Combinations",
        "file": "test_tier3_pairwise.py",
        "description": "Tests pairwise integrations between ingestion, gazetteer, clustering, and edge APIs."
    },
    4: {
        "name": "Tier 4: Real-World Application Scenarios",
        "file": "test_tier4_scenarios.py",
        "description": "Simulates 5 realistic geopolitical mission scenarios end-to-end."
    }
}


class TierResult:
    def __init__(self, tier_num: int, name: str):
        self.tier_num = tier_num
        self.name = name
        self.total = 0
        self.passed = 0
        self.failed = 0
        self.errors = 0
        self.skipped = 0
        self.duration = 0.0
        self.failure_details: List[str] = []


def run_tier(tier_num: int, verbose: bool = False) -> TierResult:
    info = TIER_MAP[tier_num]
    result = TierResult(tier_num, info["name"])
    test_dir = os.path.dirname(os.path.abspath(__file__))

    loader = unittest.TestLoader()
    suite = loader.discover(start_dir=test_dir, pattern=info["file"])

    start_time = time.time()
    test_result = unittest.TestResult()
    suite.run(test_result)
    result.duration = time.time() - start_time

    result.total = test_result.testsRun
    result.failed = len(test_result.failures)
    result.errors = len(test_result.errors)
    result.skipped = len(test_result.skipped)
    result.passed = result.total - (result.failed + result.errors + result.skipped)

    for f in test_result.failures:
        result.failure_details.append(f"FAIL in {f[0].id()}:\n{f[1]}")
    for e in test_result.errors:
        result.failure_details.append(f"ERROR in {e[0].id()}:\n{e[1]}")

    return result


def main():
    parser = argparse.ArgumentParser(description="Manekshaw.Vision E2E Test Runner")
    parser.add_argument("--tier", choices=["1", "2", "3", "4", "all"], default="all",
                        help="Specify tier to run (1, 2, 3, 4, or all)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose test execution output")
    parser.add_argument("--json", dest="json_out", help="Write metrics summary to JSON file")
    args = parser.parse_args()

    selected_tiers = [1, 2, 3, 4] if args.tier == "all" else [int(args.tier)]

    print("=" * 80)
    print("  MANEKSHAW.VISION // E2E OPAQUE-BOX ACCEPTANCE TEST SUITE")
    print(f"  Target: manvis.tech / Project Root: {PROJECT_ROOT}")
    print(f"  Execution Time: {datetime.now(timezone.utc).isoformat()}")
    print("=" * 80)

    all_results: List[TierResult] = []
    total_start = time.time()

    for t in selected_tiers:
        info = TIER_MAP[t]
        print(f"\n[*] Executing {info['name']} ...")
        print(f"    Target Module: tests/e2e/{info['file']}")
        print(f"    Scope: {info['description']}")

        res = run_tier(t, verbose=args.verbose)
        all_results.append(res)

        status_tag = "[PASS]" if (res.failed == 0 and res.errors == 0) else "[FAIL]"
        print(f"    Result: {status_tag} | Tests: {res.total} | Passed: {res.passed} | Failed: {res.failed} | Errors: {res.errors} | Duration: {res.duration:.2f}s")

        if res.failure_details and args.verbose:
            print("\n--- Failure Details ---")
            for fd in res.failure_details:
                print(fd)
            print("-----------------------")

    total_duration = time.time() - total_start
    grand_total = sum(r.total for r in all_results)
    grand_passed = sum(r.passed for r in all_results)
    grand_failed = sum(r.failed for r in all_results)
    grand_errors = sum(r.errors for r in all_results)
    grand_skipped = sum(r.skipped for r in all_results)
    overall_pass_pct = (grand_passed / grand_total * 100.0) if grand_total > 0 else 0.0

    print("\n" + "=" * 80)
    print("  E2E TEST SUITE METRICS SUMMARY")
    print("=" * 80)
    print(f"{'Tier':<45} | {'Tests':<6} | {'Passed':<6} | {'Failed':<6} | {'Duration':<8}")
    print("-" * 80)
    for r in all_results:
        tier_label = f"Tier {r.tier_num}: {r.name.split(':')[1].strip()}"
        print(f"{tier_label:<45} | {r.total:<6} | {r.passed:<6} | {r.failed:<6} | {r.duration:>6.2f}s")
    print("-" * 80)
    print(f"{'TOTAL / OVERALL':<45} | {grand_total:<6} | {grand_passed:<6} | {grand_failed:<6} | {total_duration:>6.2f}s")
    print(f"Pass Rate: {overall_pass_pct:.1f}% ({grand_passed}/{grand_total})")
    print("=" * 80)

    # Optional JSON output
    if args.json_out:
        summary_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "total_tests": grand_total,
            "passed": grand_passed,
            "failed": grand_failed,
            "errors": grand_errors,
            "skipped": grand_skipped,
            "pass_rate_pct": round(overall_pass_pct, 2),
            "duration_seconds": round(total_duration, 2),
            "tiers": [
                {
                    "tier": r.tier_num,
                    "name": r.name,
                    "tests": r.total,
                    "passed": r.passed,
                    "failed": r.failed,
                    "errors": r.errors,
                    "duration_seconds": round(r.duration, 2)
                }
                for r in all_results
            ]
        }
        with open(args.json_out, 'w', encoding='utf-8') as f:
            json.dump(summary_data, f, indent=2)
        print(f"[+] Metrics report written to: {args.json_out}")

    if grand_failed > 0 or grand_errors > 0:
        print("\n[!] TEST SUITE STATUS: FAILED")
        sys.exit(1)
    else:
        print("\n[+] TEST SUITE STATUS: PASSED (100% VERIFIED)")
        sys.exit(0)


if __name__ == '__main__':
    main()
