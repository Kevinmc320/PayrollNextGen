# backend/blockchain/log.py - Simple Audit Log Stub for PayrollNextGen
import hashlib
import json
import os
import sys
from datetime import datetime

# Import process_payroll and submit_rti
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll
from api.rti import submit_rti

def hash_data(data):
    """Generate SHA-256 hash of data."""
    return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()

def log_action(action_type, data, log_file="audit_log.json"):
    """Log an action with a hash chain for immutability."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = {
        "timestamp": timestamp,
        "action_type": action_type,
        "data": data,
        "previous_hash": ""
    }
    
    # Load existing log
    if os.path.exists(log_file):
        with open(log_file, "r") as f:
            try:
                log_chain = json.load(f)
                if not isinstance(log_chain, list):
                    log_chain = []
            except json.JSONDecodeError:
                log_chain = []
        if log_chain:
            log_entry["previous_hash"] = hash_data(log_chain[-1])
    else:
        log_chain = []
    
    # Add new entry
    log_chain.append(log_entry)
    
    # Write back to file
    with open(log_file, "w") as f:
        json.dump(log_chain, f, indent=2)
    
    print(f"Logged {action_type} at {timestamp}")
    return log_entry

def main():
    """Test audit logging with payroll and RTI actions."""
    employees = [
        {"id": "EMP001", "hours": 160, "rate": 15.0},  # Hourly
        {"id": "EMP002", "salary": 36000},             # Salaried
    ]
    
    for emp in employees:
        # Process payroll
        if "hours" in emp:
            payroll_result = process_payroll(emp["id"], hours_worked=emp["hours"], hourly_rate=emp["rate"])
        else:
            payroll_result = process_payroll(emp["id"], is_salaried=True, annual_salary=emp["salary"])
        log_action("PAYROLL_CALC", payroll_result)
        
        # Submit RTI
        rti_result = submit_rti(emp)
        log_action("RTI_SUBMISSION", rti_result)

if __name__ == "__main__":
    main()