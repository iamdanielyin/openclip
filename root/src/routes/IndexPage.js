import React, { Component } from 'react';
import { connect } from 'dva';
import Media from "react-media";
import copy from 'copy-to-clipboard';
import { message, Input, Card, Icon, Upload, Button, Alert } from 'antd';
import moment from 'moment';
import styles from './IndexPage.less';

const { TextArea } = Input;

class IndexPage extends Component {
  constructor(props) {
    super(props);
    const { index } = props;
    const { client } = index;
    client.on('onlineMembers', (data) => {
      this.setState({ onlineMembers: data });
    });
  }

  componentDidMount() {
    if (!this.state.uid) {
      this.setState({ uid: 'ibird' }, () => {
        this.handleAuth();
      });
    }
  }

  state = {
    uid: null,
    textAreaContent: null,
    clipboardData: null,
    clipboardText: null,
    clipboardHtml: null,
    clipboardImage: null,
    clipboardFile: null,
    onlineMembers: null,
    refreshTime: moment().format('YYYY-MM-DD HH:mm:ss')
  }

  handleAuth = () => {
    const { index } = this.props;
    const client = index.client;
    if (!client) return message.error('客户端未初始化');

    let uid = index.uid;
    if (uid) {
      this.props.dispatch({
        type: 'index/logout'
      });
      this.setState({ uid: null });
      client.removeAllListeners(`${uid}:paste`);
      message.success(`账号 ${uid} 已退出登录`);
    } else {
      uid = this.state.uid;
      if (!uid) return message.warn('请先输入账号哦~');
      this.props.dispatch({
        type: 'index/login',
        payload: uid,
      });
      client.on(`${uid}:paste`, this.handleRemotePaste);
      message.success(`账号 ${uid} 登录成功`);
    }
  };

  handleRemotePaste = (obj) => {
    if (typeof obj !== 'object' || !obj.data || !obj.type) {
      return console.warn('粘贴数据格式不正确');
    }
    this.setState({ clipboardData: obj, refreshTime: moment().format('YYYY-MM-DD HH:mm:ss') });
    if (typeof obj.data === 'string') {
      copy(obj.data);
    } else if (obj.data.url) {
      copy(obj.data.url);
    }
  }
  sendData = (obj) => {
    const { index } = this.props;
    const { uid } = this.state;
    const client = index.client;
    if (!client || !uid) return;

    if (typeof obj !== 'object' || !obj.data || !obj.type) {
      return console.warn('粘贴数据格式不正确');
    }
    client.emit(`${uid}:copy_or_cut`, obj);
    this.setState({ refreshTime: moment().format('YYYY-MM-DD HH:mm:ss') });
  }

  handleChange = (e) => {
    this.setState({
      uid: e.target.value
    });
  };

  uploadFile = (body, cache, callback) => {
    this.props.dispatch({
      type: 'index/uploadFile',
      payload: {
        url: '/api/upload',
        body,
        cache,
        callback
      }
    });
  }

  handlePaste = (e) => {
    const { index } = this.props;
    const { uid } = this.state;
    const client = index.client;
    if (!uid || !client) return message.error('未登录');

    let pushed = true;
    for (const item of e.clipboardData.items) {
      if (/image\//.test(item.type)) {
        // 图片
        const blob = item.getAsFile();
        if (blob) {
          const form = new FormData();
          form.append('file', blob, blob.name);
          this.uploadFile(form, { kind: item.kind, type: item.type }, (obj, url) => {
            if (url) {
              this.sendData({
                type: obj.type,
                data: {
                  name: blob.name,
                  url
                }
              });
            }
          });
        } else {
          message.warn('非图片文件，请使用上传功能');
          pushed = false;
        }
      } else if (/text\//.test(item.type)) {
        // 文本
        const text = e.clipboardData.getData(item.type);
        this.sendData({ type: item.type, data: text });
      }
    }
    e.preventDefault();
    if (pushed) {
      message.success('数据已推送', 1);
    }
  }

  handleSendTextAreaContent = (e) => {
    const data = this.state.textAreaContent;
    if (data) {
      this.sendData({ type: 'text/plain', data });
      message.success('数据已推送', 1);
      this.setState({ textAreaContent: null });
    } else {
      message.warn('请先粘贴你的内容');
    }
  }

  render() {
    const self = this;
    const { uid, clipboardData, onlineMembers, refreshTime, textAreaContent } = this.state;
    const { index } = this.props;

    let content = <Media query={{ maxWidth: 768 }}>{
      (matches) => {
        if (matches) {
          return <div className={styles.emptyContent}>暂无数据</div>;
        } else {
          return <div className={styles.emptyContent}>在此 粘贴 或 Ctrl+V~</div>;
        }
      }
    }</Media>;
    if (clipboardData && clipboardData.type && clipboardData.data) {
      if (/\/html/.test(clipboardData.type) && !clipboardData.data.url) {
        //HTML
        content = <div dangerouslySetInnerHTML={{ __html: clipboardData.data }} />;
      } else if (/text\//.test(clipboardData.type) && !clipboardData.data.url) {
        //普通文本
        content = clipboardData.data;
      } else if (/image\//.test(clipboardData.type)) {
        //图片
        content = (
          <a href={clipboardData.data} target="__blank">
            <img width="100%" alt={clipboardData.data.name} src={clipboardData.data.url} />
          </a>
        );
      } else {
        //其他文件
        const type = clipboardData.type;
        let fileIcon = null;
        if (type === 'application/pdf') {
          fileIcon = <Icon type="file-pdf" />;
        } else if (type === 'application/msword') {
          fileIcon = <Icon type="file-word" />;
        } else if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].indexOf(type) >= 0) {
          fileIcon = <Icon type="file-excel" />;
        } else if (type === 'application/vnd.ms-powerpoint') {
          fileIcon = <Icon type="file-ppt" />;
        } else if (type === 'text/plain') {
          fileIcon = <Icon type="file-text" />;
        } else if (/video\//.test(type)) {
          fileIcon = <Icon type="video-camera" />;
        } else if (/image\//.test(type)) {
          fileIcon = <Icon type="file-jpg" />;
        } else {
          fileIcon = <Icon type="file-unknown" />;
        }
        content = <a href={clipboardData.data.url} target="__blank">{fileIcon} {clipboardData.data.name}</a>;
      }
    }

    const uploadProps = {
      name: 'file',
      action: '/api/upload',
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上传成功`);
          self.sendData({
            type: info.file.type,
            data: {
              name: info.file.name,
              url: info.file.response.data
            }
          });
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上传失败`);
        }
      },
    };

    return (
      <div className={styles.content}>
        <Alert message="任意设备间，凡相同账号，信息共享。" type="info" showIcon />
        <div className={styles.authInfo}>
          <Input
            value={uid}
            onChange={this.handleChange}
            placeholder="账号"
            addonAfter={<div onClick={this.handleAuth}>{index.uid ? '退出' : '登录'}</div>}
            disabled={index.uid ? true : false}
          />
        </div>
        <Card title="剪贴板区域"
          className={styles.clipboardArea}
          extra={
            <div>
              <div>{`在线人数 ${onlineMembers || '-'}`}</div>
            </div>
          }
          onPaste={this.handlePaste}
        >
          <div className={styles.uploadArea}>
            <Upload {...uploadProps}>
              <Icon className={styles.uploadButton} type="inbox" />
            </Upload>
          </div>
          <Media query={{ maxWidth: 768 }}>{
            matches => {
              if (!matches) {
                return null;
              }
              return (
                <div>
                  <TextArea
                    placeholder={'请粘贴你的内容~'}
                    rows={5}
                    value={textAreaContent}
                    style={{ borderRadius: '4px 4px 0 0' }}
                    onChange={e => {
                      this.setState({ textAreaContent: e.target.value });
                    }}
                  />
                  <Button
                    style={{ width: '100%', borderRadius: '0 0 4px 4px' }}
                    type="primary"
                    icon="rocket"
                    onClick={this.handleSendTextAreaContent}
                  >
                    开始发送
                   </Button>
                </div>
              );
            }
          }</Media>
          <div className={styles.divider}></div>
          {content}
        </Card>
        <div className={styles.footer}>{`刷新时间：${refreshTime || '-'}`}</div>
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    loading: state.loading.global,
    index: state.index || {},
  };
}

export default connect(mapStateToProps)(IndexPage);