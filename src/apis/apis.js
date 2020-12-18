import request from './https';
import { DefaultMsgBoxOk } from './bvToast';

export const apiUserLogIn = params => request('post', '/Token/SignIn', params)
  .then(response => {
    console.log(response);
    if (response.data === '登入失敗') {
      DefaultMsgBoxOk('Login Fail.', {
        buttonSize: 'sm',
        centered: true,
        size: 'sm',
        footerClass: 'border-top-0',
        bodyClass: 'text-align'
      });
    }
    return response.data;
  });

export const apiDetail = () =>
  request('post', '/Token/GetMember');

export const apiIsAuthenticated = () => {
  return request('post', '/Token/isAuthenticated');
};

export const apiUpload = (api, formData, config) => {
  return request('post', api, formData, config)
    .then(response => {
      const msg =
        response.status === 200 && response.statusText === 'OK'
          ? 'Uploaded successed'
          : 'Uploaded fail';

      this.$bvModal.msgBoxOk(msg, {
        title: 'Message',
        buttonSize: 'sm'
      });
      console.log(response);
    })
    .catch(error => console.log(error));
};

