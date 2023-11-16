import { ref } from "vue";
import GroupService from "@/service/groupService.js";
import { useAppStore } from "@/store/app";

export default function groupComp() {
  const groupService = new GroupService();
  const appStore = useAppStore();

  const group = ref({
    id: null,
    name: "",
  });

  function sendPayload(update = false) {
    try {
      if (update) groupService.update(group.value, group.value.id);
      else groupService.insert(group.value);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    appStore,
    group,
    sendPayload,
  };
}
