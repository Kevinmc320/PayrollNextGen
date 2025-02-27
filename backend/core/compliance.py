# backend/core/compliance.py - Basic Compliance Checker for PayrollNextGen
import sys
import os
import sqlite3

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll

def check_compliance(employee_data, db_path="payrollnextgen.db", min_wage=11.44, max_hours_per_shift=11):
    """Check payroll compliance for UK rules (2025 placeholders)."""
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
    
    violations = []
    
    if "hours" in employee_data:
        hourly_rate = employee_data["rate"]
        if hourly_rate < min_wage:
            violations.append(f"Hourly rate £{hourly_rate} below minimum wage £{min_wage}")
        
        # Assume hours is monthly total, not shift—skip break/shift checks unless shift specified
        if "shift_hours" in employee_data:
            shift_hours = employee_data["shift_hours"]
            required_breaks = shift_hours // 6 * 20 / 60
            if shift_hours > 6 and "breaks" not in employee_data:
                violations.append(f"No breaks recorded for {shift_hours} hours—requires {required_breaks} hrs break")
            if shift_hours > max_hours_per_shift:
                violations.append(f"Shift exceeds {max_hours_per_shift} hours: {shift_hours} hrs")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT employee_id FROM employees WHERE employee_id = ?", (employee_data["id"],))
    if not cursor.fetchone():
        violations.append(f"Employee {employee_data['id']} not found in database")
    conn.close()
    
    print(f"Compliance check for {result['employee_id']}:")
    print(f"  Gross Pay: £{result['gross_pay']}")
    print(f"  Net Pay: £{result['net_pay']}")
    if violations:
        print("  Compliance Violations:")
        for v in violations:
            print(f"    - {v}")
    else:
        print("  Compliant with UK regulations")
    print()

    return {"employee_id": result["employee_id"], "violations": violations}

def main():
    """Test compliance checker."""
    employees = [
        {"id": "EMP001", "hours": 160, "rate": 15.0},      # Normal monthly
        {"id": "EMP003", "hours": 12, "rate": 8.0, "shift_hours": 12},  # Below min wage, shift issues
        {"id": "EMP002", "salary": 36000}                  # Salaried, normal
    ]
    
    for emp in employees:
        check_compliance(emp)

if __name__ == "__main__":
    main()