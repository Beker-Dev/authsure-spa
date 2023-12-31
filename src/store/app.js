// Utilities
import { defineStore } from "pinia";
const chRealm = localStorage.getItem("choosenRealm");
let choosenRealm = chRealm ? chRealm : null;
export const useAppStore = defineStore("app", {
  id: "normalApp",

  state: () => ({
    dialogBaseInfo: { color: "red", message: "", show: false, timeout: 1200 },
    choosenRealm
    
  }),
  actions: {
    changeDialog(payload) {
      try {
        this.dialogBaseInfo = { ...this.dialogBaseInfo, ...payload };
      } catch (error) {
        console.error(error);
      }
    },
    setChoosenRealm(payload){
      try {
        this.choosenRealm = payload
        localStorage.setItem("choosenRealm", this.choosenRealm)
      } catch (error) {
        console.error(error)
      }
    }
  },
  getters: {
    getChoosenRealm : (state) => state.choosenRealm
  }
});
