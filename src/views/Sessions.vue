<template>
  <ViewBase
    title="Sessões"
    createTitle="Nova Sessão"
    :objects="sessions"
    :labels="['Id', 'Ativa']"
    :keys="['id', 'is_active']"
    :modalEdit="modalEdit"
    :modalDelete="modalDelete"
    :onlyView="true"
    :modalInfo="modalInfo"
    @openManage="handleManage"
    @edit="callEdit"
    @delete="callDelete"
    :page="currentPage"
    :lastPage="lastPage"
    :key="index"
    @paginate="fetchSessions"
  />
  <ManageSession
    v-if="dialog"
    :dialog="dialog"
    :object="object"
    @close="closeDialog($event, fetchSessions)"
  >
  </ManageSession>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import SessionService from "@/service/sessionService.js";
import { ref, watch } from "vue";
import sessionComp from "@/compositionAPI/sessionComp";
import ManageSession from "@/components/modal/manage/ManageSession.vue";
import baseComp from "@/compositionAPI/baseComp";

const {
  object,
  dialog,
  attTable,
  handleManage,
  callEdit,
  callDeleteBase,
  closeDialog,
} = baseComp();

const { appStore } = sessionComp();

const sessionService = new SessionService();
const index = ref(0);

const currentPage = ref(1);
const lastPage = ref(1);
const sessions = ref([]);

const modalEdit = {
  title: "Editar Sessão",
};

const modalDelete = {
  title: "Deletar Sessão",
};

const modalInfo = {
  title: "Informações da Sessão",
  labels: [
    "Id",
    "Ativa",
    "Cliente",
    "Usuário",
    "Token",
    "Criada em",
    "Atualizada em",
  ],
  keys: [
    "id",
    "is_active",
    "client",
    "user",
    "token",
    "created_at",
    "updated_at",
  ],
};

function callDelete(e) {
  sessions.value = callDeleteBase(e, sessionService, sessions.value);
}

function fetchSessions(page = 1, c = 10) {
  const realm = localStorage.getItem("choosenRealm");
  const query = { page, c, realm };
  sessionService.sessions(query).then((data) => {
    sessions.value = data.sessions;
    currentPage.value = page;
    lastPage.value = data.last_page;
    index.value++;
  });
  attTable.value = 1;
}

fetchSessions();
</script>
