if (!window.Promise) {
  window.Promise = Promise;
}

const urlParams = new URLSearchParams(window.location.search);
const origin = urlParams.get('origin');
const clientId = urlParams.get('client_id');
const tokenJwt = urlParams.get('tokenJwt');
let restParams = window.location.search;
const frameData = JSON.parse(window.name);

const postPromises = {};

function parentWindowPostMessage(data) {
  return new Promise((resolve, reject) => {
    window.parent.postMessage(JSON.stringify(data), origin);
    const timerId = setTimeout(() => {
      reject();
    }, 10000);
    postPromises[data.uid] = { resolve: resolve, timer: timerId };
  });
}

window.addEventListener('message', handleMessage);

function handleMessage(event) {
  const eventData =
    event.data && typeof event.data === 'string' ? JSON.parse(event.data) : {};
  if (postPromises[eventData.uid]) {
    clearTimeout(postPromises[eventData.uid].timer);
    postPromises[eventData.uid].resolve(eventData.data);
  }
}

function showToast(message) {
  if (!!message) {
    const toasts = document.querySelector('crowdin-toasts');
    if (toasts && toasts.pushToasts) {
      toasts.pushToasts([message]);
    }
  }
}

function catchRejection(e, message) {
  showToast(e.message || message);
}

function checkResponse(response) {
  return new Promise((resolve, reject) => {
    if (response.status === 204) {
      return resolve();
    }
    response
      .json()
      .then((res) => {
        if (![200, 201, 304].includes(response.status)) {
          reject(res);
        } else {
          resolve(res);
        }
      })
      .catch((e) => {
        reject(e);
      });
  });
}

function checkOrigin() {
  return new Promise((resolve, reject) => {
    try {
      const tokenData = parseJwt(tokenJwt);
      if (tokenData.exp < parseInt(new Date().getTime() / 1000)) {
        // request for new token
        parentWindowPostMessage({
          identifier: frameData.app.identifier,
          key: frameData.app.key,
          client_id: clientId,
          command: 'token',
          uid: new Date().getTime(),
          data: {},
        })
          .then((eventData) => {
            restParams = `?origin=${origin}&client_id=${clientId}&tokenJwt=${eventData.tokenJwt}`;
            resolve(restParams);
          })
          .catch(() => reject());
      } else {
        resolve(restParams);
      }
    } catch (e) {
      reject();
    }
  });
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  return JSON.parse(jsonPayload);
}

function reloadLocation() {
  window.location.href =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    restParams;
}
