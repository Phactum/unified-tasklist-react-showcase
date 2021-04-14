import { UserTasksApi } from 'client/apis';
import { Configuration } from 'client/runtime';

let userTasksApi: UserTasksApi;

export const buildUserTasksApi = (clientBasePath?: string) => {

  const config: Configuration = new Configuration({
    basePath: clientBasePath ? clientBasePath + '/frontend-api/v1' : 'frontend-api/v1',
    credentials: 'same-origin',
  });

  userTasksApi = new UserTasksApi(config);

};

export const getUserTasksApi = () => {
  return userTasksApi;
};
