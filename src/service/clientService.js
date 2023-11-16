import Service from "./serviceBase";

class ClientService extends Service {
  constructor() {
    super();

    this.resource = "/clients";
  }

  async clients(query) {
    const requestUrl = this.createRequestUrl(query, this.resource);
    return await this.getAPI(requestUrl);
  }
  async getClient(payload) {
    const requestUrl = `${this.resource}/${payload}`;
    return await this._http.get(requestUrl);
  }
  async updateClient(payload) {
    return await this.update(payload, payload.id);
  }
}

export default ClientService;
