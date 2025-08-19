import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';

const sampleData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
];

interface Widget {
  id: string;
  type: 'lineChart';
  title: string;
  data: typeof sampleData;
}

interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
}

export default function TabTwoScreen() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
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
  const [activeDashboard, setActiveDashboard] = useState<string>('1');

  const addDashboard = () => {
    const newDashboard: Dashboard = {
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
    const newWidget: Widget = {
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

  const currentDashboard = dashboards.find((d) => d.id === activeDashboard);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Manager</Text>

      <View style={styles.controls}>
        <Button title="Add Dashboard" onPress={addDashboard} />
        <Picker
          selectedValue={activeDashboard}
          style={styles.picker}
          onValueChange={(itemValue) => setActiveDashboard(itemValue)}
        >
          {dashboards.map((dash) => (
            <Picker.Item key={dash.id} label={dash.name} value={dash.id} />
          ))}
        </Picker>
        <Button
          title="Delete Dashboard"
          onPress={() => deleteDashboard(activeDashboard)}
          disabled={dashboards.length === 1}
        />
      </View>

      <Button title="Add Widget" onPress={addWidget} color="green" />

      <Text style={styles.subtitle}>{currentDashboard?.name}</Text>

      {currentDashboard?.widgets.map((widget) => {
        const data = widget.data.map((d) => d.value);
        const labels = widget.data.map((d) => d.name);

        return (
          <View key={widget.id} style={styles.widgetContainer}>
            <View style={styles.widgetHeader}>
              <Text style={styles.widgetTitle}>{widget.title}</Text>
              <TouchableOpacity onPress={() => deleteWidget(activeDashboard, widget.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 200, flexDirection: 'row' }}>
              <YAxis
                data={data}
                contentInset={{ top: 20, bottom: 20 }}
                svg={{ fontSize: 10, fill: 'grey' }}
              />
              <LineChart
                style={{ flex: 1, marginLeft: 10 }}
                data={data}
                svg={{ stroke: 'rgb(134, 65, 244)' }}
                contentInset={{ top: 20, bottom: 20 }}
              >
                <Grid />
              </LineChart>
            </View>
            <XAxis
              style={{ marginHorizontal: -10, marginTop: 10 }}
              data={data}
              formatLabel={(value, index) => labels[index]}
              contentInset={{ left: 20, right: 20 }}
              svg={{ fontSize: 10, fill: 'black' }}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  controls: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  widgetContainer: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});
