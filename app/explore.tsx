import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

export default function TabTwoScreen() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [dashboards, setDashboards] = useState([
    {
      id: '1',
      name: 'Default Dashboard',
      widgets: [
        {
          id: '1',
          type: 'lineChart',
          title: 'Sample Metrics',
          data: sampleData,
        },
      ],
    },
  ]);
  const [activeDashboard, setActiveDashboard] = useState('1');

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const currentDashboard = dashboards.find((d) => d.id === activeDashboard);

  const addDashboard = () => {
    const newDashboard = {
      id: String(dashboards.length + 1),
      name: `Dashboard ${dashboards.length + 1}`,
      widgets: [],
    };
    setDashboards([...dashboards, newDashboard]);
  };

  const deleteDashboard = (id: string) => {
    if (dashboards.length === 1) return;
    const updated = dashboards.filter((dash) => dash.id !== id);
    setDashboards(updated);
    if (activeDashboard === id && updated.length > 0) {
      setActiveDashboard(updated[0].id);
    }
  };

  const addWidget = () => {
    const newWidget = {
      id: String(Date.now()),
      type: 'lineChart',
      title: `Widget ${Date.now()}`,
      data: sampleData,
    };
    setDashboards(
      dashboards.map((dash) =>
        dash.id === activeDashboard
          ? { ...dash, widgets: [...dash.widgets, newWidget] }
          : dash
      )
    );
  };

  const deleteWidget = (dashboardId: string, widgetId: string) => {
    setDashboards(
      dashboards.map((dash) =>
        dash.id === dashboardId
          ? { ...dash, widgets: dash.widgets.filter((w) => w.id !== widgetId) }
          : dash
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Manager</Text>

      <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
        <Text style={styles.themeToggleText}>
          Toggle Theme: {theme === 'dark' ? '🌙' : '☀️'}
        </Text>
      </TouchableOpacity>

      <View style={styles.controls}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={addDashboard}>
            <Text style={styles.buttonText}>+ Add Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonDanger,
              dashboards.length === 1 && styles.buttonDisabled,
            ]}
            onPress={() => deleteDashboard(activeDashboard)}
            disabled={dashboards.length === 1}
          >
            <Text style={styles.buttonText}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Dashboard</Text>
          <Picker
            selectedValue={activeDashboard}
            onValueChange={(itemValue) => setActiveDashboard(itemValue)}
            style={styles.picker}
            dropdownIconColor={theme === 'dark' ? '#fff' : '#000'}
          >
            {dashboards.map((dash) => (
              <Picker.Item
                key={dash.id}
                label={dash.name}
                value={dash.id}
                color={theme === 'dark' ? '#000' : '#000'}
              />
            ))}
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.buttonAddWidget} onPress={addWidget}>
        <Text style={styles.buttonText}>➕ Add Widget</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>{currentDashboard?.name}</Text>

      {currentDashboard?.widgets.map((widget) => {
        const data = widget.data.map((d) => d.value);
        const labels = widget.data.map((d) => d.name);

        return (
          <View key={widget.id} style={styles.widgetContainer}>
            <View style={styles.widgetHeader}>
              <Text style={styles.widgetTitle}>{widget.title}</Text>
              <TouchableOpacity
                onPress={() => deleteWidget(activeDashboard, widget.id)}
              >
                <Text style={styles.deleteButton}>✖</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 200, flexDirection: 'row' }}>
              <YAxis
                data={data}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#374151' }}
              />
              <LineChart
                style={{ flex: 1, marginLeft: 10 }}
                data={data}
                svg={{ stroke: theme === 'dark' ? '#60a5fa' : '#2563eb' }}
                contentInset={{ top: 20, bottom: 20 }}
              >
                <Grid svg={{ stroke: theme === 'dark' ? '#374151' : '#e5e7eb' }} />
              </LineChart>
            </View>
            <XAxis
              style={{ marginHorizontal: -10, marginTop: 10 }}
              data={data}
              formatLabel={(value, index) => labels[index]}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fontSize: 10, fill: theme === 'dark' ? '#e5e7eb' : '#111827' }}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

function createStyles(theme: 'light' | 'dark') {
  const isDark = theme === 'dark';
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: isDark ? '#111827' : '#f9fafb',
      flex: 1,
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      color: isDark ? '#f9fafb' : '#111827',
    },
    subtitle: {
      fontSize: 22,
      marginVertical: 14,
      fontWeight: '600',
      color: isDark ? '#d1d5db' : '#374151',
    },
    controls: {
      marginBottom: 20,
    },
    pickerContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 8,
      paddingHorizontal: 10,
      marginTop: 10,
    },
    picker: {
      height: 50,
      width: '100%',
      color: isDark ? '#fff' : '#000',
    },
    label: {
      fontSize: 14,
      marginBottom: 4,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    buttonPrimary: {
      backgroundColor: '#3b82f6',
      padding: 12,
      borderRadius: 8,
      flex: 1,
      alignItems: 'center',
    },
    buttonDanger: {
      backgroundColor: '#ef4444',
      padding: 12,
      borderRadius: 8,
      flex: 1,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: '#7f1d1d',
    },
    buttonAddWidget: {
      backgroundColor: '#10b981',
      padding: 14,
      borderRadius: 8,
      marginBottom: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    widgetContainer: {
      marginBottom: 24,
      padding: 16,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 3,
    },
    widgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    widgetTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDark ? '#f3f4f6' : '#1f2937',
    },
    deleteButton: {
      color: '#f87171',
      fontSize: 16,
      fontWeight: 'bold',
    },
    themeToggle: {
      marginBottom: 12,
      alignSelf: 'flex-end',
    },
    themeToggleText: {
      color: isDark ? '#e5e7eb' : '#374151',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
}
