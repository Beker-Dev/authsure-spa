import router from "@/router";
import { ref } from "vue";
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";
import UserService from "@/service/userService";
import RealmService from "@/service/realmService.js";
import RoleService from "@/service/roleService.js";
import { authUserStore } from "@/store/authStore/authStore";
export default function userComp() {
  const userouter = useRouter();
  const roleservice = new RoleService();
  const userService = new UserService();
  const realmService = new RealmService();
  const authApp = authUserStore();
  const appStore = useAppStore();
  const realms = ref([]);
  const roles = ref([]);
  const currentPg = ref(1);
  const lastPg = ref(0);
  const userRules = {
    password: [
      (v) => !!v || "Password is mandatory",
      (v) => (v && v.length >= 6) || "Password must have at least 6 characters",
    ],
    username: [(v) => !!v || "Username is mandatory"],
  };

  const user = ref({
    id: null,
    username: "",
    email: "",
    realm_id: null,
    password: "",
  });

  async function login(payload) {
    try {
      const auth = await authApp.login(payload);
      if (auth) userouter.push({ name: "Home" });
    } catch (error) {}
  }

  function sendPayload(update = false) {
    try {
     
      user.value.realm_id = user.value.realm_id ? user.value.realm_id.id : null;
      if (update) userService.update(user.value, user.value.id);
      else userService.insert(user.value);
    } catch (error) {
      console.error(error);
    }
  }

  function fetchRealms(page = 1, c = 40) {
    realmService.realms(page, c).then((data) => {
      realms.value = data.realms.filter((realm) => realm.name == localStorage.getItem("choosenRealm"));
      currentPg.value = page;
      lastPg.value = data.last_page;
    });
  }
  function fetchRoles(page = 1, c = 40) {
    const realm = localStorage.getItem("choosenRealm");
    const query = { page, c, realm };
    roleservice.roles(query).then((data) => {
      roles.value = data.roles;
      currentPg.value = page;
      lastPg.value = data.last_page;
    
    });
  }
  
  return {
    userRules,
    sendPayload,
    fetchRealms,
    fetchRoles,
    roles,
    user,
    realms,
    appStore,
    login,
  };
}
