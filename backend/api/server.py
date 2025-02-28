# backend/api/server.py - Flask API for PayrollNextGen with Gov/Charity Endpoints
from flask import Flask, jsonify
from flask_cors import CORS
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import process_payroll
from g.pay import calculate_gov_pay
from emily.tax import calculate_charity_tax

app = Flask(__name__)
CORS(app)

@app.route('/payroll/<employee_id>', methods=['GET'])
def get_payroll(employee_id):
    if employee_id == "EMP001":
        result = process_payroll(employee_id, hours_worked=160, hourly_rate=15.0)
    else:
        result = process_payroll(employee_id, is_salaried=True, annual_salary=36000)
    return jsonify(result)

@app.route('/gov_payroll/<employee_id>', methods=['GET'])
def get_gov_payroll(employee_id):
    data = {"id": employee_id}
    if employee_id == "EMP001":
        data["hours"] = 160
        data["rate"] = 15.0
        data["danger_days"] = 5
        data["night_hours"] = 20
    else:
        data["salary"] = 36000
        data["danger_days"] = 3
    result = calculate_gov_pay(data)
    return jsonify(result)

@app.route('/charity_payroll/<employee_id>', methods=['GET'])
def get_charity_payroll(employee_id):
    data = {"id": employee_id}
    if employee_id == "EMP001":
        data["hours"] = 160
        data["rate"] = 15.0
        data["gift_aid_amount"] = 100
    else:
        data["salary"] = 36000
    result = calculate_charity_tax(data)
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)