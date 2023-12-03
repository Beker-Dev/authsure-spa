import { ref } from "vue";
import GroupService from "@/service/groupService.js";
import { useAppStore } from "@/store/app";
import RealmService from "@/service/realmService.js";
import RoleService from "@/service/roleService.js";
export default function groupComp() {
  const groupService = new GroupService();
  const realmService = new RealmService();
  const appStore = useAppStore();
  const currentPg = ref(1);
  const lastPg = ref(0);
  const roleservice = new RoleService();
  const realms = ref([]);
  const roles = ref([]);
  const group = ref({
    id: null,
    name: "",
  });

  function sendPayload(update = false) {
    try {
      group.value.realm_id = group.value.realm_id
        ? group.value.realm_id.id
        : null;
      const payload = preparePayload(group.value);
      if (update) groupService.update(payload, payload.id);
      else groupService.insert(payload);
    } catch (error) {
      console.error(error);
    }
  }
  function preparePayload(role) {
    let payload = { ...role };
    if (payload.realm) delete payload["realm"];
    if (payload.users) delete payload["users"];
    return payload;
  }
  function fetchRealms(page = 1, c = 40) {
    realmService.realms(page, c).then((data) => {
      realms.value = data.realms.filter(
        (realm) => realm.name == localStorage.getItem("choosenRealm")
      );
      currentPg.value = page;
      lastPg.value = data.last_page;
    });
  }
  function fetchRoles(page = 1, c = 40) {
    const realm = localStorage.getItem("choosenRealm");
    const query = { page, c, realm };
    roleservice.roles(query).then((data) => {
      roles.value = data.roles;
      group.value.realm_id = realms.value[0];
      currentPg.value = page;
      lastPg.value = data.last_page;
    });
  }

  return {
    appStore,
    group,
    realms,
    roles,
    fetchRoles,
    fetchRealms,
    sendPayload,
  };
}
