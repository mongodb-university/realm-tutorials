import Realm from 'realm';

let app;

// Returns the shared instance of the Realm app.
export function getApp() {
  if (app === undefined) {
    const appId = 'myrealmapp-vjmee';
    const appConfig = {
      id: appId,
      url: 'https://realm-dev.mongodb.com',
      timeout: 1000,
      app: {
        name: 'default',
        version: '0',
      },
    };
    app = new Realm.App(appConfig);
  }
  return app;
}
