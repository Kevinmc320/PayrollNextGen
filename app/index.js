import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const Index = () => {
  const [coreData, setCoreData] = useState(null);
  const [govData, setGovData] = useState(null);
  const [emilyData, setEmilyData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [leaveDuration, setLeaveDuration] = useState('');
  const [leaveType, setLeaveType] = useState('days');
  const [leaveDate, setLeaveDate] = useState('');
  const [locationStatus, setLocationStatus] = useState('Checking...');
  const [shiftActive, setShiftActive] = useState(false);
  const [activeTab, setActiveTab] = useState('Shift');

  const GEOZONE = { latitude: 54.5973, longitude: -5.9301, radius: 50000 }; // Belfast, 50km radius

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const checkLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationStatus('Permission denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const inZone = isInGeofence(location.coords, GEOZONE);
        setLocationStatus(inZone ? 'In geofence' : 'Outside geofence');
      };
      checkLocation();
    } else {
      console.log('Geofencing not supported on web');
      setLocationStatus('Geofencing not available on web');
    }
  }, []);

  const isInGeofence = (coords, zone) => {
    const distance = getDistance(coords.latitude, coords.longitude, zone.latitude, zone.longitude);
    return distance <= zone.radius;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const handleLogin = () => {
    console.log('Attempting login for', employeeId);
    const authHeader = `Bearer ${password}`;
    console.log('Sending auth header:', authHeader);
    console.log('Trying password login');
    axios.get(`http://192.168.0.69:5001/payroll/${employeeId}`, {
      headers: { Authorization: authHeader }
    })
      .then(response => {
        console.log('Password login successful', response.data);
        setIsAuthenticated(true);
        setCoreData(response.data);
        fetchProfile();
      })
      .catch(error => {
        console.log('Password login failed', error.response ? error.response.data : error.message);
        alert('Incorrect employee ID or password');
      });
  };

  const startShift = async () => {
    if (Platform.OS !== 'web') {
      let location = await Location.getCurrentPositionAsync({});
      if (isInGeofence(location.coords, GEOZONE)) {
        setShiftActive(true);
        setLocationStatus('Shift started');
        console.log('Shift started', location.coords);
      } else {
        alert('You must be within the geofence to start your shift');
      }
    } else {
      setShiftActive(true);
      setLocationStatus('Shift started (web mock)');
      console.log('Shift started (web mock)');
    }
  };

  const stopShift = () => {
    setShiftActive(false);
    setLocationStatus('Shift stopped');
    console.log('Shift stopped');
  };

  const fetchCorePayroll = () => {
    if (!isAuthenticated) return;
    console.log('Fetching Core Payroll');
    axios.get(`http://192.168.0.69:5001/payroll/${employeeId}`, {
      headers: { Authorization: `Bearer ${password}` }
    })
      .then(response => {
        setCoreData(response.data);
        setGovData(null);
        setEmilyData(null);
        setProfileData(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchGovPayroll = () => {
    if (!isAuthenticated) return;
    console.log('Fetching Government Payroll');
    axios.get(`http://192.168.0.69:5001/gov_payroll/${employeeId}`, {
      headers: { Authorization: `Bearer ${password}` }
    })
      .then(response => {
        setGovData(response.data);
        setCoreData(null);
        setEmilyData(null);
        setProfileData(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchEmilyPayroll = () => {
    if (!isAuthenticated) return;
    console.log('Fetching Emily Payroll');
    axios.get(`http://192.168.0.69:5001/charity_payroll/${employeeId}`, {
      headers: { Authorization: `Bearer ${password}` }
    })
      .then(response => {
        setEmilyData(response.data);
        setCoreData(null);
        setGovData(null);
        setProfileData(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const fetchProfile = () => {
    if (!isAuthenticated) return;
    console.log('Fetching Profile');
    axios.get(`http://192.168.0.69:5001/profile/${employeeId}`, {
      headers: { Authorization: `Bearer ${password}` }
    })
      .then(response => {
        setProfileData(response.data);
        setCoreData(null);
        setGovData(null);
        setEmilyData(null);
      })
      .catch(error => console.error('Error:', error));
  };

  const requestLeave = async () => {
    if (!isAuthenticated) return;
    const duration = leaveType === 'days' ? { days: parseFloat(leaveDuration) } : { hours: parseFloat(leaveDuration) };
    console.log('Requesting Leave', duration, leaveDate);
    try {
      const response = await axios.post(`http://192.168.0.69:5001/leave/request/${employeeId}`, {
        duration: duration,
        start_date: leaveDate
      }, {
        headers: { Authorization: `Bearer ${password}` }
      });
      alert(`Leave requested! Request ID: ${response.data.request_id}`);
      fetchProfile();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.app}>
        <Text style={styles.title}><Text style={styles.axiom}>Axiom</Text><Text style={styles.pay}>Pay</Text></Text>
        <Text style={styles.tagline}>Payroll Simplified</Text>
        <View style={styles.loginContainer}>
          <TextInput style={styles.loginInput} value={employeeId} onChangeText={setEmployeeId} placeholder="Employee ID (e.g., EMP001)" />
          <TextInput style={styles.loginInput} value={password} onChangeText={setPassword} placeholder="Enter password" secureTextEntry />
          <TouchableOpacity style={styles.navButton} onPress={handleLogin}><Text style={styles.buttonText}>Login</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.app}>
      <Text style={styles.title}><Text style={styles.axiom}>Axiom</Text><Text style={styles.pay}>Pay</Text></Text>
      <Text style={styles.tagline}>Payroll Simplified</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity style={activeTab === 'Shift' ? styles.activeTab : styles.tab} onPress={() => setActiveTab('Shift')}>
          <Text style={styles.tabText}>Shift</Text>
        </TouchableOpacity>
        <TouchableOpacity style={activeTab === 'Payroll' ? styles.activeTab : styles.tab} onPress={() => setActiveTab('Payroll')}>
          <Text style={styles.tabText}>Payroll</Text>
        </TouchableOpacity>
        <TouchableOpacity style={activeTab === 'Profile' ? styles.activeTab : styles.tab} onPress={() => setActiveTab('Profile')}>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Shift' && (
        <View>
          <Text style={styles.data}>Location Status: {locationStatus}</Text>
          <TouchableOpacity style={styles.navButton} onPress={shiftActive ? stopShift : startShift}>
            <Text style={styles.buttonText}>{shiftActive ? 'Stop Shift' : 'Start Shift'}</Text>
          </TouchableOpacity>
        </View>
      )}
      {activeTab === 'Payroll' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.navButton} onPress={fetchCorePayroll}><Text style={styles.buttonText}>AxiomPay Core</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={fetchGovPayroll}><Text style={styles.buttonText}>AxiomPay Government</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={fetchEmilyPayroll}><Text style={[styles.buttonText, styles.emilyText]}>AxiomPay Emily</Text></TouchableOpacity>
          {coreData && <View style={styles.screen}><Text style={styles.subtitle}>AxiomPay Core</Text><Text style={styles.data}>Employee ID: {coreData.employee_id}</Text><Text style={styles.data}>Gross Pay: £{coreData.gross_pay.toFixed(2)}</Text><Text style={styles.data}>Net Pay: £{coreData.net_pay.toFixed(2)}</Text></View>}
          {govData && <View style={styles.screen}><Text style={styles.subtitle}>AxiomPay Government</Text><Text style={styles.data}>Employee ID: {govData.employee_id}</Text><Text style={styles.data}>Base Gross: £{govData.base_gross.toFixed(2)}</Text><Text style={styles.data}>Danger Pay: £{govData.danger_pay.toFixed(2)}</Text><Text style={styles.data}>Night Shift Bonus: £{govData.night_shift_bonus.toFixed(2)}</Text><Text style={styles.data}>Net Pay: £{govData.net_pay.toFixed(2)}</Text></View>}
          {emilyData && <View style={styles.screen}><Text style={styles.subtitle}>AxiomPay <Text style={styles.emilyText}>Emily</Text></Text><Text style={styles.data}>Employee ID: {emilyData.employee_id}</Text><Text style={styles.data}>Base Gross: £{emilyData.base_gross.toFixed(2)}</Text><Text style={styles.data}>Gift Aid Relief: £{emilyData.gift_aid_relief.toFixed(2)}</Text><Text style={styles.data}>Net Pay: £{emilyData.net_pay.toFixed(2)}</Text></View>}
        </View>
      )}
      {activeTab === 'Profile' && profileData && (
        <View style={styles.screen}>
          <Text style={styles.subtitle}>Profile</Text>
          <Text style={styles.data}>Employee ID: {profileData.employee_id}</Text>
          <Text style={styles.data}>Type: {profileData.type}</Text>
          <Text style={styles.data}>Leave Balance: {profileData.leave_balance} days</Text>
          <Text style={styles.data}>Annual Earnings: £{profileData.earnings.toFixed(2)}</Text>
          <Text style={styles.data}>Payslip: {profileData.payslip_url}</Text>
          <Text style={styles.data}>Leave Taken:</Text>
          {profileData.leave_taken.map((leave, index) => (
            <Text key={index} style={styles.data}>
              {leave.start_date}: {leave.duration.days ? `${leave.duration.days} days` : `${leave.duration.hours} hours`}
            </Text>
          ))}
          <TextInput style={styles.loginInput} value={leaveDuration} onChangeText={setLeaveDuration} placeholder="Duration (e.g., 2)" keyboardType="numeric" />
          <TextInput style={styles.loginInput} value={leaveType} onChangeText={setLeaveType} placeholder="Type (days/hours)" />
          <TextInput style={styles.loginInput} value={leaveDate} onChangeText={setLeaveDate} placeholder="Start Date (e.g., 2025-03-10)" />
          <TouchableOpacity style={styles.navButton} onPress={requestLeave}><Text style={styles.buttonText}>Request Leave</Text></TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  app: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  axiom: {
    color: '#32cd32',
  },
  pay: {
    color: '#228b22',
  },
  tagline: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTab: {
    padding: 10,
    backgroundColor: '#32cd32',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
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
    fontFamily: 'Comic Sans MS',
    color: '#ff69b4',
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