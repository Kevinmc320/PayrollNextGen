import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [coreData, setCoreData] = useState(null);
  const [govData, setGovData] = useState(null);
  const [emilyData, setEmilyData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === 'payroll123') {
      console.log('Login successful');
      setIsAuthenticated(true);
    } else {
      console.log('Login failed');
      alert('Incorrect password');
    }
  };

  const fetchCorePayroll = () => {
    if (!isAuthenticated) return;
    console.log('Fetching Core Payroll');
    axios.get('http://localhost:5001/payroll/EMP001')
      .then(response => {
        setCoreData(response.data);
        setGovData(null);
        setEmilyData(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchGovPayroll = () => {
    if (!isAuthenticated) return;
    console.log('Fetching Government Payroll');
    axios.get('http://localhost:5001/gov_payroll/EMP001')
      .then(response => {
        setGovData(response.data);
        setCoreData(null);
        setEmilyData(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchEmilyPayroll = () => {
    if (!isAuthenticated) return;
    console.log('Fetching Emily Payroll');
    axios.get('http://localhost:5001/charity_payroll/EMP001')
      .then(response => {
        setEmilyData(response.data);
        setCoreData(null);
        setGovData(null);
      })
      .catch(error => console.error('Error:', error));
  };

  if (!isAuthenticated) {
    return (
      <div className="app">
        <h1 className="title"><span className="axiom">Axiom</span><span className="pay">Pay</span></h1>
        <p className="tagline">Payroll Simplified</p>
        <div className="login-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="login-input"
          />
          <button className="nav-button" onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title"><span className="axiom">Axiom</span><span className="pay">Pay</span></h1>
      <p className="tagline">Payroll Simplified</p>
      <div className="button-container">
        <button className="nav-button" onClick={fetchCorePayroll}>AxiomPay Core</button>
        <button className="nav-button" onClick={fetchGovPayroll}>AxiomPay Government</button>
        <button className="nav-button" onClick={fetchEmilyPayroll}>AxiomPay <span className="emily">Emily</span></button>
      </div>
      {coreData && (
        <div className="screen">
          <h2 className="subtitle">AxiomPay Core</h2>
          <p className="data">Employee ID: {coreData.employee_id}</p>
          <p className="data">Gross Pay: £{coreData.gross_pay.toFixed(2)}</p>
          <p className="data">Net Pay: £{coreData.net_pay.toFixed(2)}</p>
        </div>
      )}
      {govData && (
        <div className="screen">
          <h2 className="subtitle">AxiomPay Government</h2>
          <p className="data">Employee ID: {govData.employee_id}</p>
          <p className="data">Base Gross: £{govData.base_gross.toFixed(2)}</p>
          <p className="data">Danger Pay: £{govData.danger_pay.toFixed(2)}</p>
          <p className="data">Night Shift Bonus: £{govData.night_shift_bonus.toFixed(2)}</p>
          <p className="data">Net Pay: £{govData.net_pay.toFixed(2)}</p>
        </div>
      )}
      {emilyData && (
        <div className="screen">
          <h2 className="subtitle">AxiomPay <span className="emily">Emily</span></h2>
          <p className="data">Employee ID: {emilyData.employee_id}</p>
          <p className="data">Base Gross: £{emilyData.base_gross.toFixed(2)}</p>
          <p className="data">Gift Aid Relief: £{emilyData.gift_aid_relief.toFixed(2)}</p>
          <p className="data">Net Pay: £{emilyData.net_pay.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}