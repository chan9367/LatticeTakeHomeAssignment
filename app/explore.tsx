import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
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

    <View style={styles.container}>
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.title}>Dashboard Manager</Text>

        <View style={styles.segmentedControl}>
          {dashboards.map((dash) => (
            <TouchableOpacity
              key={dash.id}
              onPress={() => setActiveDashboard(dash.id)}
              style={[
                styles.segmentButton,
                activeDashboard === dash.id && styles.segmentButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeDashboard === dash.id && styles.segmentTextActive,
                ]}
              >
                {dash.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.controls}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buttonPrimary} onPress={addDashboard}>
              <Text style={styles.buttonText}>➕ Add Dashboard</Text>
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
                  contentInset={{ top: 30, bottom: 30 }}
                  svg={{ fontSize: 10, fill: theme === 'dark' ? '#9ca3af' : '#374151' }}
                />
                <LineChart
                  style={{ flex: 1, marginLeft: 10 }}
                  data={data}
                  svg={{ stroke: theme === 'dark' ? '#60a5fa' : '#2563eb', strokeWidth: 3 }}
                  contentInset={{ top: 30, bottom: 30 }}
                >
                  <Grid
                    svg={{
                      stroke: theme === 'dark' ? '#334155' : '#e5e7eb',
                      strokeDasharray: [4, 4],
                    }}
                  />
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

      {/* Floating Theme Toggle */}
      <TouchableOpacity onPress={toggleTheme} style={styles.fabToggleTheme}>
        <Text style={styles.fabToggleIcon}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </Text>
      </TouchableOpacity>
      </SafeAreaView>
    </View>
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
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 16,
      color: isDark ? '#f9fafb' : '#111827',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      marginVertical: 14,
      color: isDark ? '#d1d5db' : '#374151',
    },
    controls: {
      marginBottom: 24,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#1f2937' : '#e5e7eb',
      borderRadius: 10,
      padding: 4,
      marginTop: 12,
      marginBottom: 16,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    segmentButtonActive: {
      backgroundColor: isDark ? '#3b82f6' : '#2563eb',
    },
    segmentText: {
      color: isDark ? '#9ca3af' : '#374151',
      fontWeight: '500',
    },
    segmentTextActive: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    buttonPrimary: {
      backgroundColor: '#3b82f6',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 100,
      alignItems: 'center',
      flex: 1,
    },
    buttonDanger: {
      backgroundColor: '#ef4444',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 100,
      alignItems: 'center',
      flex: 1,
    },
    buttonDisabled: {
      backgroundColor: '#7f1d1d',
    },
    buttonAddWidget: {
      backgroundColor: '#10b981',
      paddingVertical: 14,
      borderRadius: 100,
      marginBottom: 16,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    widgetContainer: {
      marginBottom: 24,
      padding: 16,
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
      borderWidth: 1,
      borderColor: isDark ? '#334155' : '#e2e8f0',
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
    fabToggleTheme: {
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: isDark ? '#374151' : '#e0e7ff',
      borderRadius: 30,
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    fabToggleIcon: {
      fontSize: 24,
    },
  });
}
