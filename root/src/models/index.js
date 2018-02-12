import * as apiService from '../services/api';
import socket from '../utils/socket';

const client = socket();
client.on('connect', () => {
  console.log(`客户端 ${client.id} 连接成功！`);
});

export default {
  namespace: 'index',
  state: {
    client,
    uid: null,
  },
  reducers: {
    login(state, { payload }) {
      const uid = payload;
      if (uid) {
        client.emit('login', uid);
      }
      return {
        ...state, uid
      }
    },
    logout(state) {
      client.emit('logout', state.uid);
      return {
        ...state, uid: null
      }
    }
  },
  effects: {
    * uploadFile({ payload }, { put, call, select }) {
      const { callback, cache } = payload;
      delete payload.callback;
      delete payload.cache;
      const { data, errcode, errmsg } = yield call(apiService.post, payload);
      if (!errcode && !errmsg) {
        if (typeof callback === 'function') {
          callback(cache, data);
        }
      }
    }
  }
}
