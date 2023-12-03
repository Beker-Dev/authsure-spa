import Service from "./serviceBase";
import { useAppStore } from "@/store/app";
class AuthService extends Service {
  constructor() {
    super();

    this.resource = "auth/";
  }

  async login(payload) {
    const appStore = useAppStore();
    try {
      const requestUrl = this.resource + "login";
      return await this._http.post(requestUrl, payload);
    } catch (error) {
      alert(`Erro no login: ${error}`);
      console.error(error);
    }
  }

  async refresh(payload) {
    const requestUrl = this.resource + "refresh";
    return await this._http.post(requestUrl, payload);
  }

  async logOut(payload) {
    const requestUrl = this.resource + "logout";
    return await this._http.post(requestUrl, payload);
  }
}

export default new AuthService();
