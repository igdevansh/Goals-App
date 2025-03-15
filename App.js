import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, Button, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function App() {
  const [daysLeft, setDaysLeft] = useState(0);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    const today = new Date();
    const targetDate = new Date("2026-01-01");
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
  }, []);

  useEffect(() => {
    const loadGoals = async () => {
      const storedGoals = await AsyncStorage.getItem("goals");
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    };
    loadGoals();
  }, []);

  const saveGoals = async (updatedGoals) => {
    await AsyncStorage.setItem("goals", JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (newGoal.trim() !== "") {
      const updatedGoals = [...goals, { id: Date.now().toString(), text: newGoal, completed: false, date: new Date().toLocaleDateString() }];
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      setNewGoal("");
    }
  };

  const toggleGoalCompletion = (id) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    updatedGoals.sort((a, b) => a.completed - b.completed); // Move completed goals to bottom
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <Text style={styles.countdownText}>NO. OF DAYS LEFT</Text>
      <Text style={styles.daysLeft}>{daysLeft}</Text>
      <View style={styles.divider} />

      <TextInput
        style={styles.input}
        placeholder="Add your goal..."
        value={newGoal}
        onChangeText={setNewGoal}
      />
      <Button title="Add Goal" onPress={addGoal} />

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <View style={styles.goalTextContainer}>
              <Text style={[styles.goalText, item.completed && styles.completedGoal]}>
                {item.text}
              </Text>
              <Text style={styles.goalDate}>Added on: {item.date}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleGoalCompletion(item.id)}>
              {item.completed ? (
                <AntDesign name="checkcircle" size={24} color="green" />
              ) : (
                <AntDesign name="closecircle" size={24} color="red" />
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
    justifyContent: "center",
  },
  countdownText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
  daysLeft: {
    color: "white",
    fontSize: 48,
    textAlign: "center",
    fontWeight: "bold",
  },
  divider: {
    borderBottomColor: "white",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  goalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  goalTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  goalText: {
    color: "white",
    fontSize: 18,
  },
  completedGoal: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  goalDate: {
    color: "gray",
    fontSize: 12,
    marginTop: 2,
  },
});
