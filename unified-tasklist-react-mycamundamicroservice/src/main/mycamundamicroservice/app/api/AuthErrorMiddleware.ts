import { Middleware, ResponseContext } from 'client/runtime';

export class AuthErrorMiddleware implements Middleware {
  post(context: ResponseContext): Promise<Response | void> {
    if (context.response.status === 401) {
      window.location.href = '/error-unauthorized.html?ref=' + encodeURIComponent(window.location.href);
    }
    if (context.response.status === 403) {
      return Promise.reject({
        message: {
          error: 'Data could not be loaded due to missing permissions!',
        },
      });
    }
    return Promise.resolve();
  }
}
