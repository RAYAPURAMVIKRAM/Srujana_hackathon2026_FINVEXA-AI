import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    print("[OK] GET /: OK")

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    print("[OK] GET /api/health: OK")

def test_analyze_cashflow():
    payload = {
        "current_balance": 50000.0,
        "decision_cost": 100000.0,
        "expected_revenue": 140000.0,
        "delay_days": 15,
        "advance_percent": 15.0,
        "hidden_cost_percent": 12.0,
        "locked_reserves": 20000.0,
        "batches": 1,
        "persona_type": "business",
        "monthly_income": 0.0,
        "hidden_leaks": 5000.0,
        "credit_score": 680
    }
    res = client.post("/api/analyze-cashflow", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["status"] == "success"
    assert len(data["daily_data"]) == 90
    assert "metrics" in data
    assert "risk_scores" in data
    assert len(data["risk_scores"]) == 6
    print(f"[OK] POST /api/analyze-cashflow: OK (shortage: Rs.{data['metrics']['shortage']:,}, valley_days: {data['metrics']['valley_days']}, survival: {data['metrics']['survival_probability']}%)")

def test_scan_document_sample():
    # Test invoice sample
    res = client.post("/api/scan-document", data={"sample_type": "invoice"})
    assert res.status_code == 200
    data = res.json()
    assert "extractedTerms" in data
    assert "hiddenFees" in data
    assert "fraudFlags" in data
    assert data["overallRisk"] == "warning"
    print(f"[OK] POST /api/scan-document (sample): OK ({data['type']})")

def test_scan_document_csv():
    # Test CSV transaction upload
    csv_content = """Date,Narration,Withdrawal,Deposit
2024-09-01,Opening Balance,,68200
2024-09-02,Transfer to self savings,10000,
2024-09-05,Netflix.com monthly,649,
2024-09-06,Amazon Prime Video,1499,
2024-09-10,UPI Rahul dinner split,1200,
2024-09-12,UPI Swiggy split cab,800,
2024-09-15,StarTech Vendor,25000,
"""
    files = {"file": ("sept_statement.csv", csv_content.encode("utf-8"), "text/csv")}
    res = client.post("/api/scan-document", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "extractedTerms" in data
    assert "hiddenFees" in data
    print(f"[OK] POST /api/scan-document (CSV upload): OK ({data['type']})")

def test_optimize_rescue():
    payload = {
        "persona": {
            "type": "business",
            "balance": 50000,
            "monthlyIncome": 0,
            "lockedReserves": 20000,
            "hiddenLeaks": 5000
        },
        "simulator": {
            "decisionCost": 100000,
            "paymentDelayDays": 22,
            "upfrontPercent": 15,
            "hiddenCostBuffer": 12,
            "splitBatches": 1
        }
    }
    res = client.post("/api/optimize-rescue", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["status"] == "success"
    assert len(data["plans"]) == 3
    assert "summary" in data
    for plan in data["plans"]:
        assert "id" in plan
        assert "projectedShortage" in plan
        assert "savings" in plan
        assert "negotiationMessage" in plan
    print(f"[OK] POST /api/optimize-rescue: OK (Original shortage: Rs.{data['original_shortage']:,}, 3 rescue plans generated)")

if __name__ == "__main__":
    print("Testing FINVEXA Backend endpoints...")
    test_root()
    test_health()
    test_analyze_cashflow()
    test_scan_document_sample()
    test_scan_document_csv()
    test_optimize_rescue()
    print("ALL ENDPOINTS PASSED VERIFICATION SUCCESSFULLY!")

