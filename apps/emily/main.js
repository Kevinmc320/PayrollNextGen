// apps/emily/main.js - Charity Employee App with Backend API for PayrollPro Emily
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const fetchPayrollData = async (employeeId) => {
  try {
    const response = await fetch(`http://localhost:5001/payroll/${employeeId}`);
    const data = await response.json();
    // Mock charity adjustments—later from backend\emily\tax.py
    const gift_aid = employeeId === "EMP001" ? 25.0 : 0.0;
    return {
      ...data,
      gift_aid_relief: gift_aid,
      net_pay: data.net_pay + gift_aid  // Simplified adjustment
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
      <Text style={styles.title}>PayrollPro Emily</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : payrollData ? (
        <View>
          <Text style={styles.label}>Employee ID: {payrollData.employee_id}</Text>
          <Text style={styles.label}>Base Gross: £{payrollData.gross_pay.toFixed(2)}</Text>
          <Text style={styles.label}>Gift Aid Relief: £{payrollData.gift_aid_relief.toFixed(2)}</Text>
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
