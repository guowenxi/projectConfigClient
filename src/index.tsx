import React from "react";
import dva from "dva";
import App from "@/layout/layout";
import "@/styles/global.less";
import models from "@/models";
import {qiankunWindow, renderWithQiankun} from "vite-plugin-qiankun/dist/helper";
import ReactDOM from "react-dom";
//@ts-ignore
let test = dva.default || dva;
let app = test();

models.map((model) => {
  app.model(model);
});

function renderDom() {
  app.router((obj: any) => (
      <App
          history={obj.history}
          match={obj.match}
          location={obj.location}
          getState={obj.app._store.getState}
          dispatch={obj.app._store.dispatch}
      />
  ));
  app.start("#engConfigRoot");
  return app
}

renderWithQiankun({
  mount(props) {
    console.log('工程配置 上线了',props)
    app = renderDom(props)

  },
  bootstrap() {
    console.log('bootstrap')
  },
  unmount(props) {
    console.log('工程配置 下线了',app)
    const {container} = props
    // app?.unmount()
    ReactDOM.unmountComponentAtNode(props.container ? props.container.querySelector('#engConfigRoot') : document.getElementById("engConfigRoot"));

  },
  update(props) {
    console.log('工程配置 更新了', props)
  },
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  app = renderDom({})
}
