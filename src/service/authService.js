import Service from "./serviceBase";

class AuthService extends Service {
  constructor() {
    super();

    this.resource = "auth/";
  }

  async login(payload) {
    const requestUrl = this.resource + "login";
    return await this._http.post(requestUrl, payload);
  }

  async refresh(payload) {
    const requestUrl = this.resource + "refresh";
    return await this._http.post(requestUrl, payload);
  }

  async logOut(payload) {
    const requestUrl = this.resource + "logOut";
    return await this._http.post(requestUrl, payload);
  }
}

export default new AuthService();
