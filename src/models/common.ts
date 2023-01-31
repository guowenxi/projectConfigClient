import { message } from 'antd';
// import { message } from 'antd';
import { testCnode, getPageData, login } from "@/services/common";
import { requestData } from "@/services/global";


export default {
  namespace: "common",
  state: {
    comWidth: 600,
    cnodeData: []
  },
  reducers: {
    setCnodeDataList(state: any, payLoad: any) {
      let _state = JSON.parse(JSON.stringify(state))
      _state.cnodeData = payLoad.data;
      return _state;
    },
    delete(state: any, { payload: id }: any) {
      return state.filter((item) => item.id !== id);
    },
    test(state, payload) {
      console.log("test");
      return { ...state, comWidth: 800 };
    },
  },
  effects: {
    * testCnode(payLoad: any, { put, call }: any) {
      // 发送网络请求
      let res = yield call(testCnode);
      console.log(res)
      // 判断是否有数据
      if (res.data) {
        yield put({ type: 'setCnodeDataList', data: res.data.data })
      }
    },
    // 获取数据的方法
    * getRequestData(_: any, { call, put }: any) {
      try {
        const { success, data, code } = yield call(
          requestData,
          { ..._.payload },
          _.url,
          _.method ? _.method : 'GET',
        );
        if (data.success) {
          if (_.name) {
            yield put({
              type: 'save',
              payload: {
                [_.name]: data || [],
              },
            });
          }
          if (_.callback) _.callback(data.data, data)
          return data;
        } else {
          message.warning(data.message)
        }

        // Message.error(data.message);
        // return Promise.reject(new Error(message))
      } catch (err) {
        // Message.error(err.message)
        // return Promise.reject(err)
      }
    },
    * getServerData({ payload, callback }: any, { call, put }: any) {
      const response = yield call(getPageData, payload);
      if (callback && typeof callback === "function") {
        callback(response); // 返回结果
      }
    },
    * postLogin({ payload, callback }: any, { call, put }: any) {
      const response = yield call(login, payload);
      if (callback && typeof callback === "function") {
        callback(response); // 返回结果
      }
    },
  },
};
