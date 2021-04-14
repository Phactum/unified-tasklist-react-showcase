import { hot } from 'react-hot-loader/root';
import React from 'react';
import ReactDOM from 'react-dom';
import { buildUserTasksApi } from './api/UserTasksApi';
import { UserTasks } from './usertasks';

buildUserTasksApi();

const Main: React.FC = () => (<div>
  <UserTasks></UserTasks>
</div>);

const HotMain = process.env.NODE_ENV === 'development' ? hot(Main) : Main;

const render = () => {
  ReactDOM.render(
    <HotMain />,
    document.getElementById('root')
  );
};

// sample for custom polyfill
if ('TextEncoder' in window) {
  render();
} else {
  import('./polyfills').then(render);
}
