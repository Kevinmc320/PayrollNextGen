import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [coreData, setCoreData] = useState(null);
  const [govData, setGovData] = useState(null);
  const [emilyData, setEmilyData] = useState(null);

  const fetchCorePayroll = () => {
    console.log('Fetching Core Payroll');
    axios.get('http://localhost:5001/payroll/EMP001')
      .then(response => {
        console.log('Core Payroll Data:', response.data);
        setCoreData(response.data);
        setGovData(null);
        setEmilyData(null);
      })
      .catch(error => {
        console.error('Error fetching Core Payroll:', error);
        setCoreData(null);
      });
  };

  const fetchGovPayroll = () => {
    console.log('Fetching Government Payroll');
    axios.get('http://localhost:5001/gov_payroll/EMP001')
      .then(response => {
        console.log('Government Payroll Data:', response.data);
        setGovData(response.data);
        setCoreData(null);
        setEmilyData(null);
      })
      .catch(error => {
        console.error('Error fetching Government Payroll:', error);
        setGovData(null);
      });
  };

  const fetchEmilyPayroll = () => {
    console.log('Fetching Emily Payroll');
    axios.get('http://localhost:5001/charity_payroll/EMP001')
      .then(response => {
        console.log('Emily Payroll Data:', response.data);
        setEmilyData(response.data);
        setCoreData(null);
        setGovData(null);
      })
      .catch(error => {
        console.error('Error fetching Emily Payroll:', error);
        setEmilyData(null);
      });
  };

  return (
    <div className="app">
      <h1 className="title">PayrollNextGen</h1>
      <div className="button-container">
        <button className="nav-button" onClick={fetchCorePayroll}>Core Payroll</button>
        <button className="nav-button" onClick={fetchGovPayroll}>Government Payroll</button>
        <button className="nav-button" onClick={fetchEmilyPayroll}>Emily Payroll</button>
      </div>
      {coreData && (
        <div className="screen">
          <h2 className="subtitle">Core Payroll</h2>
          <p className="data">Employee ID: {coreData.employee_id}</p>
          <p className="data">Gross Pay: £{coreData.gross_pay.toFixed(2)}</p>
          <p className="data">Net Pay: £{coreData.net_pay.toFixed(2)}</p>
        </div>
      )}
      {govData && (
        <div className="screen">
          <h2 className="subtitle">Government Payroll</h2>
          <p className="data">Employee ID: {govData.employee_id}</p>
          <p className="data">Base Gross: £{govData.base_gross.toFixed(2)}</p>
          <p className="data">Danger Pay: £{govData.danger_pay.toFixed(2)}</p>
          <p className="data">Night Shift Bonus: £{govData.night_shift_bonus.toFixed(2)}</p>
          <p className="data">Net Pay: £{govData.net_pay.toFixed(2)}</p>
        </div>
      )}
      {emilyData && (
        <div className="screen">
          <h2 className="subtitle">Emily Payroll</h2>
          <p className="data">Employee ID: {emilyData.employee_id}</p>
          <p className="data">Base Gross: £{emilyData.base_gross.toFixed(2)}</p>
          <p className="data">Gift Aid Relief: £{emilyData.gift_aid_relief.toFixed(2)}</p>
          <p className="data">Net Pay: £{emilyData.net_pay.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}