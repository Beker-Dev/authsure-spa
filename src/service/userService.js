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
}

export default UserService;