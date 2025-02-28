// apps/g/main.js - Government Employee App with Backend API for PayrollPro G
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const fetchPayrollData = async (employeeId) => {
  try {
    const response = await fetch(`http://localhost:5001/payroll/${employeeId}`);
    const data = await response.json();
    // Mock gov adjustments—later from backend\g\pay.py
    return {
      ...data,
      danger_pay: employeeId === "EMP001" ? 250.0 : 150.0,
      night_shift_bonus: employeeId === "EMP001" ? 150.0 : 0.0,
      net_pay: employeeId === "EMP001" ? data.net_pay + 400.0 : data.net_pay + 150.0
    };
  } catch (error) {
    console.error("Error fetching payroll:", error);
    return null;
  }
};

const PayrollScreen = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const employeeId = "EMP001";
  
  const loadPayroll = async () => {
    setLoading(true);
    const data = await fetchPayrollData(employeeId);
    setPayrollData(data);
    setLoading(false);
  };
  
  useEffect(() => {
    loadPayroll();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PayrollPro G</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : payrollData ? (
        <View>
          <Text style={styles.label}>Employee ID: {payrollData.employee_id}</Text>
          <Text style={styles.label}>Base Gross: £{payrollData.gross_pay.toFixed(2)}</Text>
          <Text style={styles.label}>Danger Pay: £{payrollData.danger_pay.toFixed(2)}</Text>
          <Text style={styles.label}>Night Shift Bonus: £{payrollData.night_shift_bonus.toFixed(2)}</Text>
          <Text style={styles.label}>Net Pay: £{payrollData.net_pay.toFixed(2)}</Text>
          <Button title="Refresh" onPress={loadPayroll} />
        </View>
      ) : (
        <Text>No payroll data available</Text>
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