import axios from "axios";
import { useAppStore } from "@/store/app";

function verifyURL() {
  const hostname = window.location.hostname;
  // 10.0.0.0 - 10.255.255.255
  // 172.16.0.0 - 172.31.255.255
  // 192.168.0.0 - 192.168.255.255

  const arrHostname = hostname.split(".");
  if (
    arrHostname[0] == "localhost" ||
    arrHostname[0] == 10 ||
    (arrHostname[0] == 172 && arrHostname[1] >= 16 && arrHostname[1] < 32) ||
    (arrHostname[0] == 192 && arrHostname[1] == 168)
  )
    return import.meta.env.VITE_API_URL || "http://localhost:8000/api/";

  return import.meta.env.VITE_API_URL;
}

const http = axios.create({
  baseURL: verifyURL(),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(async function (config) {
  const authUser = JSON.parse(localStorage.getItem("auth"));
  if (authUser) {
    const token = `Bearer ${authUser.access || ""}`;
    config.headers.Authorization = token;
  }
  return config;
});
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    let originalRequest = error && error.config ? error.config : null;
    const errorStatus = error && error.response ? error.response.status : null;
    const errorDetail =
      error && error.response.data.detail ? error.response.data.detail : null;

    if (originalRequest.data) {
      const data = JSON.parse(originalRequest.data);
      if (data.first) {
        localStorage.removeItem("auth");
        return error;
      }
    }
    if (
      errorStatus == 401 &&
      errorDetail == "Invalid token" &&
      !originalRequest.first
    ) {
      console.log("exception");
      try {
        let useStore = JSON.parse(localStorage.getItem("auth"));
        useStore.first = true;
        const { data } = await refresh(useStore);
        if (data) {
          originalRequest.headers.Authorization = "Bearer " + data.access;
          return axios(originalRequest);
        }
      } catch (error) {
        console.log(error);
        originalRequest.first = true;
        return axios(originalRequest);
      }
    }
    if (errorStatus == 403) {
      const appStore = useAppStore();
      appStore.changeDialog({
        color: "red",
        message: `Sem permissão para realizar essa ação.`,
        show: true,
      });
    }

    return error;
  }
);

// http.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   async function (error) {
//     store.state.networkError = error.code == 'ERR_NETWORK'

//     const originalRequest = (await error) && error.config ? error.config : null
//     const errorStatus = error && error.response ? error.response.status : null
//     const errorStatusText =
//       error && error.response ? error.response.statusText : null
//     const errorText =
//       error && error.response ? error.response.data?.error : null
//     const urlLogout =
//       error && error.config ? error.config.baseURL + 'auth/logout' : ''

//     /*
//      * Quando a requisição tem status 401 e statusText,
//      * será gerado uma nova requisição para gerar um novo token automaticamente
//      */

//     const adminContext = store.state.adminModule.adminContext

//     let authUser = null
//     if (adminContext == 'Admin')
//       authUser = store.state.authAdminModule.authAdminUser
//     else authUser = store.state.authModule.authUser

//     if (errorStatus === 401 && errorText === 'Token is Expired') {
//       const authPropName = store.state.authModule.storageAuthProperty
//       const access_token = await refreshAccessToken()

//       let user = ''
//       user = JSON.parse(localStorage.getItem(authPropName))
//       if (user && user != '') {
//         user.access_token = access_token.data.token
//         localStorage.setItem(authPropName, JSON.stringify(user))
//       }

//       if (adminContext == 'Admin')
//         await store.dispatch('authAdminModule/updateAuthUser', user)
//       else await store.dispatch('authModule/updateAuthUser', user)

//       originalRequest.headers.Authorization =
//         'Bearer ' + access_token.data.token
//       return axios(originalRequest)
//       /*
//        * Quando expirar o tempo de realizar o refresh automático do token,
//        * será solicitado o relogin para o usuário
//        */
//     } else if (
//       errorStatus === 401 &&
//       (errorText === 'Token is Invalid' || errorText === 'Unauthenticated.')
//     ) {
//       if (adminContext == 'Admin')
//         store.dispatch('authAdminModule/clearAuthUser')
//       else store.dispatch('authModule/clearAuthUser')
//     }
//     return handlingError(error)
//   }
// )

// async function refreshAccessToken() {
//   return await http.post('/mbcommerce/auth-company/refresh')
// }

async function refresh(payload) {
  return await http.post("/auth/refresh", payload).then((res) => {
    localStorage.setItem("auth", JSON.stringify(res.data));
    return res;
  });
}
async function logOut(payload) {
  localStorage.removeItem("auth");
  return await http.post("/auth/logout", payload);
}

// function error404() {
//   return 'Ooops... nada por aqui'
// }

export default http;
