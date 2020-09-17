import React from "react";
import styled from "@emotion/styled";
import useTasks from "../graphql/useTasks";
import TaskContent from "./TaskContent";
import TaskDetailModal from "./TaskDetailModal";
import EditPermissionsModal from "./EditPermissionsModal";
import Card from "./Card";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import { uiColors } from "@leafygreen-ui/palette";

export default function ProjectScreen({
  currentProject,
  isEditingPermissions,
  setIsEditingPermissions,
}) {
  return (
    <Container>
      {currentProject && <TaskList currentProject={currentProject} />}
      <EditPermissionsModal
        project={currentProject}
        isEditingPermissions={isEditingPermissions}
        setIsEditingPermissions={setIsEditingPermissions}
      />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  grid-area: main;
  background: ${uiColors.gray.light2};
`;

function useDraftTask({ addTask }) {
  const [draftTask, setDraftTask] = React.useState(null);
  const createDraftTask = () => {
    setDraftTask({ name: "" });
  };
  const deleteDraftTask = () => {
    setDraftTask(null);
  };
  const setDraftTaskName = (name) => {
    setDraftTask({ name });
  };
  const submitDraftTask = async () => {
    await addTask(draftTask);
    setDraftTask(null);
  };
  return { draftTask, createDraftTask, deleteDraftTask, setDraftTaskName, submitDraftTask };
}

function TaskList({ currentProject }) {
  const { tasks, addTask } = useTasks(currentProject);
  const getTaskById = (id) => tasks.find((task) => task._id === id);
  const [selectedTaskId, setSelectedTaskId] = React.useState(null);
  const selectedTask = getTaskById(selectedTaskId);

  const {
    draftTask,
    createDraftTask,
    deleteDraftTask,
    setDraftTaskName,
    submitDraftTask,
  } = useDraftTask({ addTask });

  return (
    <>
      <List>
        {tasks.map((task) => (
          <ListItem key={task._id}>
            <Card onClick={() => setSelectedTaskId(task._id)}>
              <TaskContent task={task} />
            </Card>
          </ListItem>
        ))}
        {draftTask ? (
          <ListItem>
            <Card>
              <TextInput
                type="text"
                placeholder="Do the dishes"
                onChange={(e) => {
                  setDraftTaskName(e.target.value);
                }}
                value={draftTask.name}
              />
              <Button
                variant="primary"
                disabled={!draftTask.name}
                onClick={() => {
                  submitDraftTask();
                }}
              >
                Add
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteDraftTask();
                }}
              >
                Cancel
              </Button>
            </Card>
          </ListItem>
        ) : (
          <ListItem>
            <Card>
              <Button onClick={() => createDraftTask()}>Add Task</Button>
            </Card>
          </ListItem>
        )}
      </List>
      <TaskDetailModal
        project={currentProject}
        task={selectedTask}
        unselectTask={setSelectedTaskId}
      />
    </>
  );
}

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
  width: 400px;
`;
const ListItem = styled.li`
  :not(:first-of-type) {
    margin-top: 8px;
  }
`;
