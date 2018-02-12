/*
 * 通用接口操作模块
 * @Author: yinfxs 
 * @Date: 2017-09-02 08:41:11 
 * @Last Modified by: yinfxs
 * @Last Modified time: 2018-02-11 12:12:06
 */

import request from '../utils/request';
import { get, post, put, del } from './api';

/**
 * 调用模型默认列表查询接口
 * @param url
 * @param onError
 * @returns {Object}
 */
export function list({ url, onError }) {
  return get({ url, onError });
}

/**
 * 调用模型默认ID查询接口
 * @param url
 * @param onError
 * @returns {Object}
 */
export function id({ url, onError }) {
  return get({ url, onError });
}

/**
 * 调用模型默认新增接口
 * @param url
 * @param body
 * @param onError
 * @returns {Object}
 */
export function create({ url, body = {}, onError }) {
  return post({ url, body, onError });
}

/**
 * 调用模型默认修改接口
 * @param url
 * @param body
 * @param onError
 * @returns {Object}
 */
export function update({ url, body = {}, onError }) {
  return put({ url, body, onError });
}

/**
 * 调用模型默认删除接口
 * @param url
 * @param body
 * @param onError
 * @returns {Object}
 */
export function remove({ url, body = {}, onError }) {
  return del({ url, body, onError });
}