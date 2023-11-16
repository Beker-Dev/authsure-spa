import RealmService from "@/service/realmService.js";
import { useAppStore } from "@/store/app";
import { ref } from "vue";

export default function realComp() {
  const realmService = new RealmService();
  const appStore = useAppStore();

  const realm = ref({
    name: "",
  });

  function sendPayload(update = false) {
    try {
      if (update) realmService.updateRealm(realm.value);
      else realmService.insert(realm.value);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    appStore,
    realm,
    sendPayload,
  };
}
