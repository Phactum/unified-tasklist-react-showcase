import { AuthErrorMiddleware } from './AuthErrorMiddleware';
import { MyformkeyApi } from 'client/apis';
import { Configuration } from 'client/runtime';

const myformkeyApi: any = {};

export const getMyformkeyApi = (clientBasePath?: string): MyformkeyApi => {

  const basePath = clientBasePath ? clientBasePath + '/api/v1' : 'api/v1';

  const client = myformkeyApi[basePath];
  if (client) {
    return client;
  }

  const config: Configuration = new Configuration({
    basePath: clientBasePath ? clientBasePath + '/api/v1' : 'api/v1',
    credentials: 'same-origin',
    middleware: [new AuthErrorMiddleware()],
  });
  const newClient = new MyformkeyApi(config);

  myformkeyApi[basePath] = newClient;

  return newClient;

};
