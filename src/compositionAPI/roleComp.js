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
      role.value.realm_id = role.value.realm_id
      ? role.value.realm_id.id
      : null;
      if (update) roleService.updateRole(role.value);
      else roleService.insert(role.value);
    } catch (error) {
      console.error(error);
    }
  }
  function fetchRealms(page = 1, c = 40) {
    realmService.realms(page, c).then((data) => {
      realms.value = data.realms;
      currentPg.value = page;
      lastPg.value = data.last_page;
    });
  }

  return {
    appStore,
    role,
    realms,
    sendPayload,
    fetchRealms
  };
}
