import { ref } from "vue";
import { useAppStore } from "@/store/app";
export default function baseComp() {
  const object = ref(null);
  const appStore = useAppStore();
  const dialog = ref(false);
  const attTable = ref(null);
  const baseRealm = appStore.getChoosenRealm

  function callEdit(e) {
    object.value = e;
    dialog.value = true;
  }
  function handleManage(e) {
    dialog.value = e;
  }

  function closeDialog(e, functionName = null) {
    dialog.value = false;
    object.value = null;
    if(functionName)
      functionName()
  }

  function callDeleteBase(e, service, list) {
    try {
      if (e) {
        service.delete(e);
        appStore.changeDialog({
          color: "green",
          message: `Item ${e} deletado com sucesso !`,
          show: true,
        });
        list = list.filter((i) => i.id !== e);
        return list;
      }
    } catch (error) {
      console.error(error);
      appStore.changeDialog({
        color: "red",
        message: error,
        show: true,
      });
    }
  }

  return {
    object,
    dialog,
    attTable,
    baseRealm,
    callDeleteBase,
    callEdit,
    handleManage,
    closeDialog
  };
}
