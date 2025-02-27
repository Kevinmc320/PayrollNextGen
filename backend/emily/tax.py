# backend/emily/tax.py - Charity/NGO Tax Logic for PayrollPro Emily
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll, calculate_paye, calculate_ni

def calculate_charity_tax(employee_data, gift_aid_rate=0.25):
    """Calculate payroll with charity tax reliefs (e.g., Gift Aid)."""
    # Base payroll from main.py
    if "hours" in employee_data:
        base_result = process_payroll(
            employee_data["id"],
            hours_worked=employee_data["hours"],
            hourly_rate=employee_data["rate"]
        )
    else:
        base_result = process_payroll(
            employee_data["id"],
            is_salaried=True,
            annual_salary=employee_data["salary"]
        )
    
    # Charity adjustments
    adjustments = {"gift_aid_relief": 0}
    
    if "gift_aid_amount" in employee_data:
        donation = employee_data["gift_aid_amount"]
        relief = donation * gift_aid_rate
        adjustments["gift_aid_relief"] = relief
    
    # Adjust gross and recalculate PAYE/NI with rounding
    adjusted_gross = max(0, base_result["gross_pay"] - adjustments["gift_aid_relief"])
    adjusted_paye = round(calculate_paye(adjusted_gross), 2)
    adjusted_ni = round(calculate_ni(adjusted_gross), 2)
    net_pay = round(adjusted_gross - adjusted_paye - adjusted_ni, 2)
    
    result = {
        "employee_id": base_result["employee_id"],
        "base_gross": base_result["gross_pay"],
        "gift_aid_relief": adjustments["gift_aid_relief"],
        "adjusted_gross": adjusted_gross,
        "paye": adjusted_paye,
        "ni": adjusted_ni,
        "net_pay": net_pay
    }
    
    print(f"Charity payroll for {result['employee_id']}:")
    print(f"  Base Gross: £{result['base_gross']}")
    print(f"  Gift Aid Relief: £{result['gift_aid_relief']}")
    print(f"  Adjusted Gross: £{result['adjusted_gross']}")
    print(f"  PAYE: £{result['paye']}")
    print(f"  NI: £{result['ni']}")
    print(f"  Net Pay: £{result['net_pay']}\n")
    
    return result

def main():
    """Test charity tax logic."""
    employees = [
        {"id": "EMP001", "hours": 160, "rate": 15.0, "gift_aid_amount": 100},
        {"id": "EMP002", "salary": 36000}
    ]
    
    for emp in employees:
        calculate_charity_tax(emp)

if __name__ == "__main__":
    main()