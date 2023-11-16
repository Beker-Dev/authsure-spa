import { ref } from "vue";
import GroupService from "@/service/groupService.js";
import { useAppStore } from "@/store/app";
import RealmService from "@/service/realmService.js";
export default function groupComp() {
  const groupService = new GroupService();
  const realmService = new RealmService();
  const appStore = useAppStore();
  const currentPg = ref(1);
  const lastPg = ref(0);

  const realms = ref([]);
  const group = ref({
    id: null,
    name: "",
  });

  function sendPayload(update = false) {
    try {
      group.value.realm_id = group.value.realm_id
        ? group.value.realm_id.id
        : null;
      if (update) groupService.update(group.value, group.value.id);
      else groupService.insert(group.value);
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
    group,
    realms,
    fetchRealms,
    sendPayload,
  };
}
