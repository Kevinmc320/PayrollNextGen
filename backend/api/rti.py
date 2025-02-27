# backend/api/rti.py - HMRC RTI Submission Stub for PayrollNextGen
from datetime import datetime
import sys
import os

# Import process_payroll from main.py (relative path from api/ to backend/)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll

def submit_rti(employee_data, employer_id="123/ABC456"):
    """Simulate HMRC RTI FPS submission for an employee."""
    if "hours" in employee_data:
        payroll_result = process_payroll(
            employee_data["id"],
            hours_worked=employee_data["hours"],
            hourly_rate=employee_data["rate"]
        )
    else:
        payroll_result = process_payroll(
            employee_data["id"],
            is_salaried=True,
            annual_salary=employee_data["salary"]
        )
    
    fps_data = {
        "employer_id": employer_id,
        "submission_date": datetime.now().strftime("%Y-%m-%d"),
        "employee": {
            "id": payroll_result["employee_id"],
            "gross_pay": payroll_result["gross_pay"],
            "paye_deducted": payroll_result["paye"],
            "ni_deducted": payroll_result["ni"],
            "net_pay": payroll_result["net_pay"]
        }
    }
    
    print(f"Submitting RTI FPS to HMRC for {employer_id}:")
    print(f"Date: {fps_data['submission_date']}")
    print(f"Employee {fps_data['employee']['id']}:")
    print(f"  Gross Pay: £{fps_data['employee']['gross_pay']}")
    print(f"  PAYE Deducted: £{fps_data['employee']['paye_deducted']}")
    print(f"  NI Deducted: £{fps_data['employee']['ni_deducted']}")
    print(f"  Net Pay: £{fps_data['employee']['net_pay']}")
    print("Submission successful (mocked)\n")
    
    return fps_data

def main():
    """Test RTI submission."""
    employees = [
        {"id": "EMP001", "hours": 160, "rate": 15.0},  # Hourly
        {"id": "EMP002", "salary": 36000},             # Salaried
    ]
    
    for emp in employees:
        submit_rti(emp)

if __name__ == "__main__":
    main()