import {getList} from "@/services/test";

export default {
    namespace: "test",
    state: {
        cnodeData: []
    },
    reducers: {},
    effects: {
        // 获取数据的方法
        * getRequestData(_: any, {call, put}: any) {
            try {
                const {data} = yield call(
                    getList,
                    {..._.payload},
                    _.url,
                    _.method ? _.method : 'GET',
                );
                if (data.success) {
                    if (_.callback) _.callback(data);
                    return data;
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
