/*
 * 通用接口操作模块
 * @Author: yinfxs
 * @Date: 2017-09-02 08:41:11
 * @Last Modified by: yinfxs
 * @Last Modified time: 2018-02-12 10:07:16
 */

import request from '../utils/request';
import constants from '../utils/constants';

/**
 * 常规GET请求
 * @param url
 * @returns {Object}
 */
export function get({ url, options, onError }) {
  url = urlfix(url);
  return request({ url, options, onError });
}

/**
 * 常规POST请求
 * @param url
 * @param onError
 * @returns {Object}
 */
export function post({ url, body, options, onError }) {
  url = urlfix(url);
  return request({
    url,
    options: Object.assign(options || {}, {
      method: 'POST',
      body,
    }),
    onError,
  });
}

/**
 * 常规PUT请求
 * @param url
 * @param onError
 * @returns {Object}
 */
export function put({ url, body, options, onError }) {
  url = urlfix(url);
  return request({
    url,
    options: Object.assign(options || {}, {
      method: 'PUT',
      body,
    }),
    onError,
  });
}

/**
 * 常规DELETE请求
 * @param url
 * @param onError
 * @returns {Object}
 */
export function del({ url, body, options, onError }) {
  url = urlfix(url);
  return request({
    url,
    options: Object.assign(options || {}, {
      method: 'DELETE',
      body,
    }),
    onError,
  });
}

/**
 * 请求默认模型接口带上前缀
 * @param url
 */
export function urlfix(url) {
  if (!url || url.startsWith('http')) return url;

  let correctUrl = url;
  if (url.startsWith('/')) {
    correctUrl = url.startsWith(constants.API_PREFIX) ? url : `${constants.API_PREFIX}${url}`;
  } else {
    correctUrl = `${constants.API_PREFIX}/${url}`;
  }
  return correctUrl;
}
