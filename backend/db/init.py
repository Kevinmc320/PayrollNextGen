# backend/db/init.py - SQLite Database Setup for PayrollNextGen
import sqlite3
import os
import sys

# Add parent directory to path for importing process_payroll
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll

def init_db(db_path="payrollnextgen.db"):
    """Initialize SQLite database with employee and payroll tables."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create employees table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            employee_id TEXT PRIMARY KEY,
            first_name TEXT,
            last_name TEXT,
            is_salaried INTEGER,
            hourly_rate REAL DEFAULT 0,
            annual_salary REAL DEFAULT 0
        )
    """)
    
    # Create payroll_records table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payroll_records (
            record_id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id TEXT,
            date TEXT,
            hours_worked REAL,
            gross_pay REAL,
            paye REAL,
            ni REAL,
            net_pay REAL,
            FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        )
    """)
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {db_path}")

def insert_employee(cursor, employee_id, first_name, last_name, is_salaried, hourly_rate=0, annual_salary=0):
    """Insert an employee into the database."""
    cursor.execute("""
        INSERT OR REPLACE INTO employees (employee_id, first_name, last_name, is_salaried, hourly_rate, annual_salary)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (employee_id, first_name, last_name, is_salaried, hourly_rate, annual_salary))

def insert_payroll_record(cursor, employee_id, hours_worked=0, payroll_result=None):
    """Insert a payroll record linked to an employee."""
    from datetime import datetime
    date = datetime.now().strftime("%Y-%m-%d")
    if payroll_result:
        cursor.execute("""
            INSERT INTO payroll_records (employee_id, date, hours_worked, gross_pay, paye, ni, net_pay)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (employee_id, date, hours_worked, payroll_result["gross_pay"], payroll_result["paye"],
              payroll_result["ni"], payroll_result["net_pay"]))

def main():
    """Test database initialization and data insertion."""
    db_path = "payrollnextgen.db"
    init_db(db_path)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Test employees
    employees = [
        {"id": "EMP001", "first_name": "John", "last_name": "Doe", "is_salaried": 0, "hourly_rate": 15.0},
        {"id": "EMP002", "first_name": "Jane", "last_name": "Smith", "is_salaried": 1, "annual_salary": 36000}
    ]
    
    # Insert employees and payroll records
    for emp in employees:
        insert_employee(cursor, emp["id"], emp["first_name"], emp["last_name"], emp["is_salaried"],
                        emp.get("hourly_rate", 0), emp.get("annual_salary", 0))
        if emp["is_salaried"]:
            result = process_payroll(emp["id"], is_salaried=True, annual_salary=emp["annual_salary"])
        else:
            result = process_payroll(emp["id"], hours_worked=160, hourly_rate=emp["hourly_rate"])
        insert_payroll_record(cursor, emp["id"], 160 if not emp["is_salaried"] else 0, result)
        print(f"Added {emp['id']} to database: Gross £{result['gross_pay']}, Net £{result['net_pay']}")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()