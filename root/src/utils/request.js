import fetch from 'dva/fetch';
import { message } from 'antd';


/**
 * 执行请求
 *
 * @param  {string} url - 请求地址
 * @param  {object} [options] - 请求参数
 * @param  {function} [onError] - 自定义异常处理函数
 */
export default async function request({ url, options, onError }) {
  options = options || {};
  Object.assign(options, { credentials: 'same-origin' });

  let data = null;
  try {
    const res = await fetch(url, options);
    if (res.status >= 200 && res.status < 300) {
      data = await res.json();
    } else {
      throw new Error(res.statusText);
    }
  } catch (error) {
    console.error(error);
    message.error('网络异常，请稍后重试');
  }

  // 通用错误检测
  if (data.errmsg || data.errcode) {
    if (typeof onError === 'function') {
      onError(data);
    } else {
      message.error(data.errmsg || '网络异常，请稍后重试');
    }
    if (data.errstack) {
      console.error(data.errstack);
    }
  }
  return data;
}