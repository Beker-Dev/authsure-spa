import { ref } from "vue";
import UserService from "@/service/userService.js";
import SessionService from "@/service/sessionService.js"
import { useAppStore } from "@/store/app";
export default function clientComp() {
  const userService = new UserService();
  const sessionService = new SessionService();
  const appStore = useAppStore();
  const users = ref([]);

  const session = ref({
    id: null,
    token: null,
    user_id: null,
  });

  const userList = ref(null);
  const currentPg = ref(1);
  const lastPg = ref(0);
  async function sendPayload(update = false) {
    try {
      session.value.user_id = session.value.user_id
        ? session.value.user_id.id
        : null;
      if (update) await sessionService.updateSession(session.value);
      else await sessionService.insert(session.value);
    } catch (error) {
      console.error(error);
    }
  }
  function fetchUsers(page = 1, c = 40) {
    const realm = localStorage.getItem("choosenRealm");;
    const query = {page, c, realm}
    userService.users(query).then((data) => {
      users.value = data.users;
      currentPg.value = page;
      lastPg.value = data.last_page;
    });
  }
  async function getSession(id) {
    try {
      const { data } = await sessionService.getSession(id);
      session.value = { ...data };
      session.value.user_id = users.value.find(
        (i) => i.id == session.value.user_id
      );
    } catch (error) {
      console.error(error);
    }
  }

  return {
    session,
    sendPayload,
    fetchUsers,
    getSession,
    userList,
    users,
    currentPg,
    lastPg,
    appStore,
  };
}
