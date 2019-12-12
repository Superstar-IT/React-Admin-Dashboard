import { notification } from 'antd'
import { post } from './net'


export async function login(email, password) {
  const params = {
    email,
    password
  };

  return new Promise((resolve, reject) => {
    console.log('api',process.env.REACT_APP_API_URL);
    const url = `${process.env.REACT_APP_API_URL}login`;
    post(url, params, false).then(json => {
      if (!json.success) {
        notification.warning({
          message: json.message,
          description: '',
        });
        return false
      }
      localStorage.setItem('user', JSON.stringify(json.data));
      return resolve(true);
    })
        .catch(err => {
          return reject(err);
        });
  })
}

export async function currentAccount() {
  function getCurrentUser() {
    return new Promise((resolve) => {
      const user = localStorage.getItem('user');
      if (user) {
        resolve(user)
      }
      return false;
    })
  }
  return getCurrentUser()
}

export async function logout() {
  localStorage.removeItem('user');
  return true;
}
