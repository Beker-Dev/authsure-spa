import Service from "./serviceBase";

class AuditService extends Service {
  constructor() {
    super();
    this.resource = "/audits";
  }

  async audits(query) {
    const requestUrl = this.createRequestUrl(query, this.resource);
    return await this.getAPI(requestUrl);
  }
}

export default AuditService;
