// apps/g/main.js - Government Employee App with Biometric and Retina Scan Stubs
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const fetchPayrollData = async (employeeId) => {
  try {
    const response = await fetch(`http://localhost:5001/gov_payroll/${employeeId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching payroll:", error);
    return null;
  }
};

const PayrollScreen = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fingerAuthenticated, setFingerAuthenticated] = useState(false);
  const [retinaAuthenticated, setRetinaAuthenticated] = useState(false);
  
  const employeeId = "EMP001";
  
  const authenticateFingerprint = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Mock fingerprint
    setFingerAuthenticated(true);
    setLoading(false);
  };
  
  const authenticateRetina = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Mock retina scan
    setRetinaAuthenticated(true);
    setLoading(false);
  };
  
  const loadPayroll = async () => {
    setLoading(true);
    const data = await fetchPayrollData(employeeId);
    setPayrollData(data);
    setLoading(false);
  };
  
  useEffect(() => {
    authenticateFingerprint(); // Auto-authenticate fingerprint
  }, []);

  useEffect(() => {
    if (fingerAuthenticated) {
      authenticateRetina(); // Auto-authenticate retina after fingerprint
    }
  }, [fingerAuthenticated]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PayrollPro G</Text>
      {loading ? (
        <Text>{retinaAuthenticated ? "Loading payroll..." : fingerAuthenticated ? "Scanning retina..." : "Scanning fingerprint..."}</Text>
      ) : fingerAuthenticated && retinaAuthenticated ? (
        payrollData ? (
          <View>
            <Text style={styles.label}>Employee ID: {payrollData.employee_id}</Text>
            <Text style={styles.label}>Base Gross: £{payrollData.base_gross.toFixed(2)}</Text>
            <Text style={styles.label}>Danger Pay: £{payrollData.danger_pay.toFixed(2)}</Text>
            <Text style={styles.label}>Night Shift Bonus: £{payrollData.night_shift_bonus.toFixed(2)}</Text>
            <Text style={styles.label}>Net Pay: £{payrollData.net_pay.toFixed(2)}</Text>
            <Button title="Refresh" onPress={loadPayroll} />
          </View>
        ) : (
          <Text>No payroll data available</Text>
        )
      ) : (
        <View>
          {!fingerAuthenticated && <Button title="Login with Fingerprint" onPress={authenticateFingerprint} />}
          {fingerAuthenticated && !retinaAuthenticated && <Button title="Scan Retina" onPress={authenticateRetina} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 18, marginVertical: 5 }
});

export default PayrollScreen;