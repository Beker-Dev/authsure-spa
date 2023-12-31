import AuthService from "@/service/authService";
import { defineStore } from "pinia";
import { useAppStore } from "../app";
const authUser = localStorage.getItem("auth");
let user = authUser ? JSON.parse(authUser) : null;

export const authUserStore = defineStore("auth", {
  state: () => {
    user;
  },
  actions: {
    async login(payload) {
      const appStore = useAppStore();
      try {
        const { data } = await AuthService.login(payload);
        this.user = data;
        this.user.name = payload.username;
        appStore.changeDialog({
          color: "green",
          message: `Login efetuado com sucesso !`,
          show: true,
        });
        localStorage.setItem("auth", JSON.stringify(this.user));
        return true;
      } catch (er) {
        console.error(er);
        return false;
      }
    },
    async refresh() {
      try {
        const { data } = await AuthService.refresh(this.user);
        this.user = data;
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    async logOut() {
      try {
        await AuthService.logOut(this.user);
        this.user = null;
        localStorage.removeItem("auth");
      } catch (error) {
        console.error(error);
      }
    },
  },
});
