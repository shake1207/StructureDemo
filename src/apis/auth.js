import request from '.https';

const auth = {
  SignIn(params) {
    return request('post', '/Token/SignIn', params);
  },
  IsAuthenticated() {
    return request('post', '/Token/isAuthenticated');
  }
};

export default auth;
