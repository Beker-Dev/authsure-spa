import Service from "./serviceBase";

class GroupService extends Service {
  constructor() {
    super();

    this.resource = "/groups";
  }

  async groups() {
    const requestUrl = this.resource;
    return await this.getAPI(requestUrl);
  }
}

export default GroupService;