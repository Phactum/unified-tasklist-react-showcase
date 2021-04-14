import React, { useState, useEffect } from 'react';
import { getUserTasksApi } from '../api/UserTasksApi';
import { UserTask } from '../usertask';

interface MyProps { };

export const UserTasks: React.FC<MyProps> = props => {

  const [tasks, setTasks] = useState(undefined);
  const [selectedTask, selectTask] = useState(undefined);
  const [task, setTask] = useState(undefined);
  
  useEffect(() => {
    if (!tasks) {
      loadUsertasks();
    }
  }, []);

  const loadUsertasks = async () => {
    const api = getUserTasksApi();
    const usertasks = await api.getUserTasksDetails();
    setTasks(usertasks);
  };

  const loadUsertask = async () => {
    const api = getUserTasksApi();
    const usertask = await api.getUserTaskDetails({ taskId: selectedTask });
    setTask(usertask);
  };

  useEffect(() => {
    if (selectedTask) {
      loadUsertask();
    }
  }, [selectedTask]);

  return (<div>
      <h1>All usertasks</h1>
      <ol>
        {
          tasks
          ? tasks.map(task => (<li key={task.id}>
            <a href="javascript://"
                onClick={() => selectTask(task.id)}>{ task.id }</a>: { task.status }</li>))
          : (<></>)
        }
      </ol>
      {
        task
          ? <div>
              <h2>Usertask form { task.id }</h2>
              <div style={{ border: 'solid 1px black' }}>
                <UserTask task={ task }></UserTask>
              </div>
            </div>
          : (<></>)
      }
    </div>);

}
