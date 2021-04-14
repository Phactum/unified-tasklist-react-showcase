import React from 'react';
import useWebpackModule from 'app/hooks/useWebpackModule';
import { ExportComponents } from '@unified-tasklist/common/types/'; 

export interface MyProps {
  task: any;
};

const fixPath = (path: string | null | undefined) => String(path).replace(/^\/\//, '/');

export const UserTask: React.FC<MyProps> = ({ task }) => {
  
  const url = `/frontend`;
  const webpackPath = `/${task.tenant}/${task.tenant}-api/webpack/${task.formKey}`;

  const { components, error, loaded } = useWebpackModule(url, fixPath(webpackPath), 'form');

  if (error) {
    return <div>error: { error }</div>;
  }
  if (!loaded) {
    return <div>loading component</div>;
  }
  const UserTaskForm = (components as ExportComponents.ComponentCollection).Form;
  return <UserTaskForm task={task} clientBasePath={task.tenant}></UserTaskForm>;

}
