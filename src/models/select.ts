import {requestData} from "@/services/global";

export default {
    namespace: "select",
    state: {
        selectList: []
    },
    reducers: {
        setSelectData(state: any, payLoad: any) {
            let _state = JSON.parse(JSON.stringify(state))
            _state[payLoad.key] = payLoad.data;
            return _state;
        },
    },
    effects: {
        // 获取数据的方法
        * getSelectData(_: any, {call, put}: any) {
            try {
                const {data} = yield call(
                    requestData,
                    {..._.payload},
                    _.url,
                    _.method ? _.method : 'GET',
                );
                if (data.success) {
                    yield put({type: 'setSelectData', data: data.data, key: _.payload.typeClass})
                }
                // Message.error(message);
                // return Promise.reject(new Error(message))
            } catch (err) {
                // Message.error(err.message)
                // return Promise.reject(err)
            }
        },

    },
};
