import router from "@/router";
import { ref } from "vue";
import { useAppStore } from "@/store/app";
import GroupService from "@/service/groupService.js";
import { useRouter } from "vue-router";
import UserService from "@/service/userService";
import RealmService from "@/service/realmService.js";
import RoleService from "@/service/roleService.js";
import { authUserStore } from "@/store/authStore/authStore";
export default function userComp() {
  const userouter = useRouter();

  const groupService = new GroupService();
  const roleservice = new RoleService();
  const userService = new UserService();
  const realmService = new RealmService();
  const authApp = authUserStore();
  const appStore = useAppStore();
  const realms = ref([]);
  const roles = ref([]);
  const groups = ref([]);
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
      if (auth) userouter.push({ name: "realms" });
    } catch (error) {
      console.error(error);
    }
  }

  function sendPayload(update = false) {
    try {
      let data = null;
      user.value.realm_id = user.value.realm_id ? user.value.realm_id.id : null;
      if (update)
        data = userService.update(user.value, user.value.id).then((res) => {
          return res.data;
        });
      else
        data = userService.insert(user.value).then((res) => {
          return res.data;
        });
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  function fetchRealms(page = 1, c = 40) {
    realmService.realms(page, c).then((data) => {
      realms.value = data.realms.filter(
        (realm) => realm.name == localStorage.getItem("choosenRealm")
      );
      user.value.realm_id = realms.value[0].id;
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
  function fetchGroups(page = 1, c = 40) {
    const realm = localStorage.getItem("choosenRealm");
    const query = { page, c, realm };
    groupService.groups(query).then((data) => {
      groups.value = data.groups;
      currentPg.value = page;
      lastPg.value = data.last_page;
    });
  }

  return {
    userRules,
    sendPayload,
    fetchRealms,
    fetchRoles,
    fetchGroups,
    groups,
    roles,
    user,
    realms,
    appStore,
    login,
  };
}
