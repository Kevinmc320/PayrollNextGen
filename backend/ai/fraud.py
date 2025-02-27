# backend/ai/fraud.py - Basic AI Fraud Detection Stub for PayrollNextGen
import sys
import os

# Import process_payroll from main.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll

def detect_fraud(employee_data, max_hours=200, min_rate=10.0):
    """Detect potential payroll fraud based on thresholds."""
    # Process payroll data
    if "hours" in employee_data:
        result = process_payroll(
            employee_data["id"],
            hours_worked=employee_data["hours"],
            hourly_rate=employee_data["rate"]
        )
    else:
        result = process_payroll(
            employee_data["id"],
            is_salaried=True,
            annual_salary=employee_data["salary"]
        )
    
    # Fraud checks
    fraud_flags = []
    
    # Check 1: Excessive hours (hourly only)
    if "hours" in employee_data:
        if employee_data["hours"] > max_hours:
            fraud_flags.append(f"Excessive hours: {employee_data['hours']} > {max_hours}")
    
    # Check 2: Unrealistic hourly rate
    if "rate" in employee_data:
        if employee_data["rate"] < min_rate:
            fraud_flags.append(f"Low rate: £{employee_data['rate']} < £{min_rate}")
    
    # Check 3: Negative net pay (shouldn’t happen)
    if result["net_pay"] < 0:
        fraud_flags.append("Negative net pay detected")
    
    # Result
    print(f"Analyzing {result['employee_id']} for fraud:")
    print(f"  Gross Pay: £{result['gross_pay']}")
    print(f"  Net Pay: £{result['net_pay']}")
    if fraud_flags:
        print("  Fraud Flags:")
        for flag in fraud_flags:
            print(f"    - {flag}")
    else:
        print("  No fraud detected")
    print()

    return {"employee_id": result["employee_id"], "flags": fraud_flags}

def main():
    """Test fraud detection."""
    employees = [
        {"id": "EMP001", "hours": 160, "rate": 15.0},    # Normal
        {"id": "EMP002", "hours": 250, "rate": 8.0},    # Excessive hours, low rate
        {"id": "EMP003", "salary": 36000},               # Normal salaried
    ]
    
    for emp in employees:
        detect_fraud(emp)

if __name__ == "__main__":
    main()
