import RoleService from "@/service/roleService.js";
import { useAppStore } from "@/store/app";
import { ref } from "vue";

export default function realComp() {
  const roleService = new RoleService();
  const appStore = useAppStore();

  const role = ref({
    name: "",
  });

  function sendPayload(update = false) {
    try {
      if (update) roleService.updateRole(role.value);
      else roleService.insert(role.value);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    appStore,
    role,
    sendPayload,
  };
}
