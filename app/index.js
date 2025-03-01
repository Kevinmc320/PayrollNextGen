import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

export default function Index() {
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
      <View style={styles.app}>
        <Text style={styles.title}>
          <Text style={styles.axiom}>Axiom</Text>
          <Text style={styles.pay}>Pay</Text>
        </Text>
        <Text style={styles.tagline}>Payroll Simplified</Text>
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.loginInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          <TouchableOpacity style={styles.navButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.app}>
      <Text style={styles.title}>
        <Text style={styles.axiom}>Axiom</Text>
        <Text style={styles.pay}>Pay</Text>
      </Text>
      <Text style={styles.tagline}>Payroll Simplified</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={fetchCorePayroll}>
          <Text style={styles.buttonText}>AxiomPay Core</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={fetchGovPayroll}>
          <Text style={styles.buttonText}>AxiomPay Government</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={fetchEmilyPayroll}>
          <Text style={[styles.buttonText, styles.emilyText]}>AxiomPay Emily</Text>
        </TouchableOpacity>
      </View>
      {coreData && (
        <View style={styles.screen}>
          <Text style={styles.subtitle}>AxiomPay Core</Text>
          <Text style={styles.data}>Employee ID: {coreData.employee_id}</Text>
          <Text style={styles.data}>Gross Pay: £{coreData.gross_pay.toFixed(2)}</Text>
          <Text style={styles.data}>Net Pay: £{coreData.net_pay.toFixed(2)}</Text>
        </View>
      )}
      {govData && (
        <View style={styles.screen}>
          <Text style={styles.subtitle}>AxiomPay Government</Text>
          <Text style={styles.data}>Employee ID: {govData.employee_id}</Text>
          <Text style={styles.data}>Base Gross: £{govData.base_gross.toFixed(2)}</Text>
          <Text style={styles.data}>Danger Pay: £{govData.danger_pay.toFixed(2)}</Text>
          <Text style={styles.data}>Night Shift Bonus: £{govData.night_shift_bonus.toFixed(2)}</Text>
          <Text style={styles.data}>Net Pay: £{govData.net_pay.toFixed(2)}</Text>
        </View>
      )}
      {emilyData && (
        <View style={styles.screen}>
          <Text style={styles.subtitle}>
            AxiomPay <Text style={styles.emilyText}>Emily</Text>
          </Text>
          <Text style={styles.data}>Employee ID: {emilyData.employee_id}</Text>
          <Text style={styles.data}>Base Gross: £{emilyData.base_gross.toFixed(2)}</Text>
          <Text style={styles.data}>Gift Aid Relief: £{emilyData.gift_aid_relief.toFixed(2)}</Text>
          <Text style={styles.data}>Net Pay: £{emilyData.net_pay.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  axiom: {
    color: '#32cd32', // Bright lime green
  },
  pay: {
    color: '#228b22', // Darker forest green
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#32cd32',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emilyText: {
    fontFamily: 'Comic Sans MS', // Handwritten, platform-dependent
    color: '#ff69b4', // Base pink
  },
  screen: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#228b22',
  },
  data: {
    fontSize: 16,
    marginVertical: 8,
    color: '#333',
  },
  loginContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginInput: {
    padding: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#32cd32',
    borderRadius: 5,
    width: 220,
  },
});