// apps/core/main.js - Employee App Stub for PayrollNextGen (Core)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

// Mock backend data (replace with API call later)
const fetchPayrollData = async (employeeId) => {
  // Simulate backend call to main.py
  const mockData = {
    employee_id: employeeId,
    gross_pay: employeeId === "EMP001" ? 2400.0 : 3000.0,
    net_pay: employeeId === "EMP001" ? 1950.36 : 2350.86
  };
  return new Promise(resolve => setTimeout(() => resolve(mockData), 1000));
};

const PayrollScreen = () => {
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const employeeId = "EMP001"; // Hardcoded for demo
  
  const loadPayroll = async () => {
    setLoading(true);
    try {
      const data = await fetchPayrollData(employeeId);
      setPayrollData(data);
    } catch (error) {
      console.error("Error fetching payroll:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadPayroll();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PayrollNextGen</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : payrollData ? (
        <View>
          <Text style={styles.label}>Employee ID: {payrollData.employee_id}</Text>
          <Text style={styles.label}>Gross Pay: £{payrollData.gross_pay.toFixed(2)}</Text>
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
