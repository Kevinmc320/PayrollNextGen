# backend/api/server.py - Simple Flask API for PayrollNextGen with CORS
from flask import Flask, jsonify
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/payroll/<employee_id>', methods=['GET'])
def get_payroll(employee_id):
    if employee_id == "EMP001":
        result = process_payroll(employee_id, hours_worked=160, hourly_rate=15.0)
    else:
        result = process_payroll(employee_id, is_salaried=True, annual_salary=36000)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)