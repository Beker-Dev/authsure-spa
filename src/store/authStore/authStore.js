import AuthService from "@/service/authService";
import { defineStore } from "pinia";

const authUser = localStorage.getItem("auth");
let user = authUser ? JSON.parse(authUser) : null;

export const authUserStore = defineStore("auth", {
  state: () => {
    user;
  },
  actions: {
    async login(payload) {
      try {
        const { data } = await AuthService.login(payload);
        this.user = data;
        this.user.name = payload.username;
        localStorage.setItem("auth", JSON.stringify(this.user));
        return true;
      } catch (er) {
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
      } catch (error) {
        console.error(error);
      }
    },
  },
});
