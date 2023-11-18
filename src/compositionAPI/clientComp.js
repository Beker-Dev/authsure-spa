import { ref } from "vue";
import RealmService from "@/service/realmService.js";
import ClientService from "@/service/clientService";
import { useAppStore } from "@/store/app";
export default function clientComp() {
  const realmService = new RealmService();
  const clientService = new ClientService();
  const appStore = useAppStore();
  const realms = ref([]);

  const client = ref({
    id: null,
    name: null,
    description: null,
    key: null,
    secret: null,
    realm_id: null,
  });

  const realmList = ref(null);
  const currentPg = ref(1);
  const lastPg = ref(0);
  async function sendPayload(update = false) {
    try {
      client.value.realm_id = client.value.realm_id
        ? client.value.realm_id.id
        : null;
      if (update) await clientService.updateClient(client.value);
      else await clientService.insert(client.value);
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
  async function getClient(id) {
    try {
      const { data } = await clientService.getClient(id);
      client.value = { ...data };
      client.value.realm_id = realms.value.find(
        (i) => i.id == client.value.realm_id
      );
    } catch (error) {
      console.error(error);
    }
  }

  return {
    client,
    sendPayload,
    fetchRealms,
    getClient,
    realmList,
    realms,
    currentPg,
    lastPg,
    appStore,
  };
}
