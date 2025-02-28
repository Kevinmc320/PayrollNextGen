# backend/g/pay.py - Government Payroll Logic for PayrollPro G
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll

def calculate_gov_pay(employee_data, danger_pay_rate=50.0, night_shift_rate=1.5):
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
    
    adjustments = {"danger_pay": 0, "night_shift_bonus": 0}
    if "danger_days" in employee_data:
        adjustments["danger_pay"] = employee_data["danger_days"] * danger_pay_rate
    if "night_hours" in employee_data:
        night_hours = employee_data["night_hours"]
        adjustments["night_shift_bonus"] = night_hours * employee_data["rate"] * (night_shift_rate - 1)
    
    total_gross = base_result["gross_pay"] + adjustments["danger_pay"] + adjustments["night_shift_bonus"]
    total_paye = base_result["paye"]
    total_ni = base_result["ni"]
    total_net = total_gross - total_paye - total_ni
    
    result = {
        "employee_id": base_result["employee_id"],
        "base_gross": base_result["gross_pay"],
        "danger_pay": adjustments["danger_pay"],
        "night_shift_bonus": adjustments["night_shift_bonus"],
        "total_gross": total_gross,
        "paye": total_paye,
        "ni": total_ni,
        "net_pay": total_net
    }
    print(f"Government payroll for {result['employee_id']}:")
    print(f"  Base Gross: £{result['base_gross']}")
    print(f"  Danger Pay: £{result['danger_pay']}")
    print(f"  Night Shift Bonus: £{result['night_shift_bonus']}")
    print(f"  Total Gross: £{result['total_gross']}")
    print(f"  PAYE: £{result['paye']}")
    print(f"  NI: £{result['ni']}")
    print(f"  Net Pay: £{result['net_pay']}\n")
    
    return result

def main():
    employees = [
        {"id": "EMP001", "hours": 160, "rate": 15.0, "danger_days": 5, "night_hours": 20},
        {"id": "EMP002", "salary": 36000, "danger_days": 3}
    ]
    for emp in employees:
        calculate_gov_pay(emp)

if __name__ == "__main__":
    main()
