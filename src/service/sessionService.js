import Service from "./serviceBase";

class SessionService extends Service {
  constructor() {
    super();

    this.resource = "/sessions";
  }

  async sessions(query) {
    const requestUrl = this.createRequestUrl(query, this.resource);
    return await this.getAPI(requestUrl);
  }
  async getSession(payload) {
    const requestUrl = `${this.resource}/${payload}`;
    return await this._http.get(requestUrl);
  }
  async updateSession(payload) {
    return await this.update(payload, payload.id);
  }
}

export default SessionService;