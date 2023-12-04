import Service from "./serviceBase";

class UserService extends Service {
  constructor() {
    super();

    this.resource = "/users";
  }

  async users(query) {
    const requestUrl = this.createRequestUrl(query, this.resource);
    return await this.getAPI(requestUrl);
  }
  async changePassword(payload, id) {
    const requestUrl = `${this.resource}/${id} `;
    return await this._http.patch(requestUrl, payload);
  }
  async recoverUser(payload) {
    return await this._http.post(`${this.resource}/recover-password`, payload);
  }
}

export default UserService;
