import React, { useState } from "react";

import { View, Button } from "react-native";
import styles from "../stylesheet";

import { Overlay, Text } from "react-native-elements";
import { ManageTeam } from "../components/ManageTeam";

import { useTasks } from "../providers/TasksProvider";
import { TaskItem } from "../components/TaskItem";
import { AddTask } from "../components/AddTask";

export function TasksView({ navigation, route }) {
  const { name } = route.params;
  const [overlayVisible, setOverlayVisible] = useState(false);

  const { tasks, createTask } = useTasks();

  navigation.setOptions({
    headerRight: () => <AddTask createTask={createTask} />,
  });

  return (
    <View>
      <Text>View the tasks for {name}:</Text>

      {tasks.map((task) =>
        task ? <TaskItem key={`${task._id}`} task={task} /> : null
      )}

      <Button title="Manage Team" onPress={() => setOverlayVisible(true)} />

      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        <ManageTeam />
      </Overlay>
    </View>
  );
}
