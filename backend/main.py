# backend/main.py - Core Payroll Processing for PayrollNextGen
import sys

def calculate_gross_pay(hours_worked, hourly_rate, is_salaried=False, annual_salary=0):
    """Calculate gross pay for hourly or salaried employees."""
    if is_salaried:
        return annual_salary / 12  # Monthly salary
    return hours_worked * hourly_rate

def calculate_paye(gross_pay):
    """Simplified UK PAYE tax calculation (2025 rates placeholder)."""
    personal_allowance = 12570  # Annual allowance
    monthly_allowance = personal_allowance / 12
    taxable = max(0, gross_pay - monthly_allowance)
    if taxable <= 0:
        return 0
    elif taxable <= 4189:  # 20% up to £50,270 annual equivalent
        return taxable * 0.20
    else:
        return (4189 * 0.20) + ((taxable - 4189) * 0.40)  # 40% above

def calculate_ni(gross_pay):
    """Simplified UK National Insurance (Class 1, 2025 placeholder)."""
    monthly_threshold = 1048  # £12,570 annual
    upper_threshold = 4189  # £50,270 annual
    ni_pay = max(0, gross_pay - monthly_threshold)
    if ni_pay <= 0:
        return 0
    elif ni_pay <= (upper_threshold - monthly_threshold):
        return ni_pay * 0.1325  # 13.25% primary threshold
    else:
        return ((upper_threshold - monthly_threshold) * 0.1325) + ((ni_pay - (upper_threshold - monthly_threshold)) * 0.0325)  # 3.25% above

def process_payroll(employee_id, hours_worked=0, hourly_rate=0, is_salaried=False, annual_salary=0):
    """Process payroll for one employee."""
    gross = calculate_gross_pay(hours_worked, hourly_rate, is_salaried, annual_salary)
    paye = calculate_paye(gross)
    ni = calculate_ni(gross)
    net_pay = gross - paye - ni
    return {
        "employee_id": employee_id,
        "gross_pay": round(gross, 2),
        "paye": round(paye, 2),
        "ni": round(ni, 2),
        "net_pay": round(net_pay, 2)
    }

def main():
    """Main function for testing payroll processing."""
    employees = [
        {"id": "EMP001", "hours": 160, "rate": 15.0},  # Hourly worker
        {"id": "EMP002", "salary": 36000},             # Salaried worker
    ]
    
    for emp in employees:
        if "hours" in emp:
            result = process_payroll(emp["id"], hours_worked=emp["hours"], hourly_rate=emp["rate"])
        else:
            result = process_payroll(emp["id"], is_salaried=True, annual_salary=emp["salary"])
        print(f"Employee {result['employee_id']}:")
        print(f"  Gross Pay: £{result['gross_pay']}")
        print(f"  PAYE: £{result['paye']}")
        print(f"  NI: £{result['ni']}")
        print(f"  Net Pay: £{result['net_pay']}\n")

if __name__ == "__main__":
    main()