import http from "@/service/index";
export default class Service {
  constructor() {
    this._http = http;
  }

  hasParameter(string) {
    return string.lastIndexOf("?") > 0 ? "&" : "?";
  }

  createRequestUrl(query1 = null, resource = null) {
    let requestUrl = "";

    if (resource) {
      requestUrl = resource;
    } else {
      requestUrl = `${this.resource}`;
    }

    let query = Object.assign({}, query1);
    query = this.encodeQueryValues(query);

    Object.keys(query).forEach((e) => {
      if (query[e] && (query[e].length > 0 || query[e] > 0)) {
        requestUrl += this.hasParameter(requestUrl) + `${e}=${query[e]}`;
      }
    });
    return requestUrl;
  }

  encodeQueryValues(query) {
    Object.keys(query).forEach((key) => {
      if (query[key] !== "" && typeof query[key] == "string")
        query[key] = encodeURIComponent(query[key]);
    });
    return query;
  }

  handlingError(error) {
    try {
      if (!error.data) {
        return Promise.reject(error);
      }

      const { statusText, data } = error;

      return Promise.reject(data.error || statusText);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /* API METHODS */

  async getAPI(requestUrl) {
    try {
      let response = await http.get(requestUrl);
      return response.data;
    } catch (e) {
      return this.handlingError(e);
    }
  }

  async insert(payload) {
    try {
      const { data } = await http.post(this.resource, { ...payload });
      return data;
    } catch (e) {
      return this.handlingError(e);
    }
  }

  async update(payload, id) {
    try {
      const { data } = await http.put(`${this.resource}/${id}`, {
        ...payload,
      });

      return data;
    } catch (e) {
      return this.handlingError(e);
    }
  }

  async delete(id) {
    try {
      const { data } = await http.delete(`${this.resource}/${id}`);

      return data;
    } catch (e) {
      return this.handlingError(e);
    }
  }
}
