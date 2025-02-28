// apps/emily/main.js - Charity Employee App with Backend API and Biometric Stub
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const fetchPayrollData = async (employeeId) => {
  try {
    const response = await fetch(`http://localhost:5001/charity_payroll/${employeeId}`);
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
  const [authenticated, setAuthenticated] = useState(false);
  
  const employeeId = "EMP001";
  
  const authenticate = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Mock biometric
    setAuthenticated(true);
    setLoading(false);
  };
  
  const loadPayroll = async () => {
    setLoading(true);
    const data = await fetchPayrollData(employeeId);
    setPayrollData(data);
    setLoading(false);
  };
  
  useEffect(() => {
    authenticate(); // Auto-authenticate for demo
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PayrollPro Emily</Text>
      {loading ? (
        <Text>{authenticated ? "Loading payroll..." : "Authenticating..."}</Text>
      ) : authenticated ? (
        payrollData ? (
          <View>
            <Text style={styles.label}>Employee ID: {payrollData.employee_id}</Text>
            <Text style={styles.label}>Base Gross: £{payrollData.base_gross.toFixed(2)}</Text>
            <Text style={styles.label}>Gift Aid Relief: £{payrollData.gift_aid_relief.toFixed(2)}</Text>
            <Text style={styles.label}>Net Pay: £{payrollData.net_pay.toFixed(2)}</Text>
            <Button title="Refresh" onPress={loadPayroll} />
          </View>
        ) : (
          <Text>No payroll data available</Text>
        )
      ) : (
        <Button title="Login with Biometrics" onPress={authenticate} />
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