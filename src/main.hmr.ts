import { bootstrap } from './main';

// tslint:disable-next-line:no-any
declare const module: any;

void bootstrap().then((app) => {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => void app.close());
  }
});
