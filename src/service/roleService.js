import Service from "./serviceBase";

class RoleService extends Service {
  constructor() {
    super();

    this.resource = "/roles";
  }

  async roles(query) {
    const requestUrl = this.createRequestUrl(query, this.resource);
    return await this.getAPI(requestUrl);
  }
  async updateRole(payload) {
    return await this.update(payload, payload.id);
  }
}

export default RoleService;