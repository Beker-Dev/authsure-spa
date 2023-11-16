import Service from "./serviceBase";

class RealmService extends Service {
  constructor() {
    super();

    this.resource = "/realms";
  }

  async realms(page, c) {
    const requestUrl = this.resource;
    return await this.getAPI(requestUrl, page, c);
  }
  async updateRealm(payload) {
    return await this.update(payload, payload.id);
  }
}

export default RealmService;
