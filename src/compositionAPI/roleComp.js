import RoleService from "@/service/roleService.js";
import { useAppStore } from "@/store/app";
import { ref } from "vue";
import RealmService from "@/service/realmService.js";

export default function realComp() {
  const roleService = new RoleService();
  const appStore = useAppStore();
  const realmService = new RealmService();
  const currentPg = ref(1);
  const lastPg = ref(0);
  const realms = ref([]);
  const role = ref({
    name: "",
  });

  function sendPayload(update = false) {
    try {
      role.value.realm_id = role.value.realm_id ? role.value.realm_id.id : null;
      const payload = preparePayload(role.value);
      if (update) roleService.updateRole(payload);
      else roleService.insert(payload);
    } catch (error) {
      console.error(error);
    }
  }
  function preparePayload(role) {
    let payload = { ...role };
    if (payload.realm) delete payload["realm"];
    if (payload.clients) delete payload["clients"];
    return payload;
  }
  function fetchRealms(page = 1, c = 40, update = false) {
    realmService.realms(page, c).then((data) => {
      realms.value = data.realms.filter(
        (realm) => realm.name == localStorage.getItem("choosenRealm")
      );
      if (!update) role.value.realm_id = realms.value[0];
      currentPg.value = page;
      lastPg.value = data.last_page;
    });
  }

  return {
    appStore,
    role,
    realms,
    sendPayload,
    fetchRealms,
  };
}
