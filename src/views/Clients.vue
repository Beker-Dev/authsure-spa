<template>
  <ViewBase
    title="Clientes"
    createTitle="Novo Cliente"
    :objects="clients"
    :labels="['Id', 'Nome', 'Chave', 'Segredo']"
    :keys="['id', 'name', 'key', 'secret']"
    :modalEdit="modalEdit"
    :modalDelete="modalDelete"
    :modalInfo="modalInfo"
    @openManage="handleManage($event)"
    @delete="callDelete($event)"
    @edit="callEdit"
    :page="currentPage"
    :lastPage="lastPage"
    :key="index"
    @paginate="fetchClients"
  />
  <ManageClient
    v-if="dialog"
    :dialog="dialog"
    :object="object"
    @close="closeDialog($event, fetchClients)"
  >
  </ManageClient>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import ManageClient from "@/components/modal/manage/ManageClient.vue";
import ClientService from "@/service/clientService.js";
import { ref, onMounted } from "vue";
import baseComp from "@/compositionAPI/baseComp";

const {
  object,
  dialog,
  appStore,
  handleManage,
  callEdit,
  callDeleteBase,
  closeDialog,
} = baseComp();

const clientService = new ClientService();
const index = ref(0);

const currentPage = ref(1);
const lastPage = ref(1);
const clients = ref([]);

const modalEdit = {
  title: "Editar Cliente",
};

const modalDelete = {
  title: "Deletar Cliente",
};

const modalInfo = {
  title: "Informações do Cliente",
  labels: [
    "Id",
    "Nome",
    "Chave",
    "Segredo",
    "Reino",
    "Cargos",
    "Descrição",
    "Criado em",
    "Atualizado em",
  ],
  keys: [
    "id",
    "name",
    "key",
    "secret",
    "realm",
    "roles",
    "description",
    "created_at",
    "updated_at",
  ],
};

function callDelete(e) {
  clients.value = callDeleteBase(e, clientService, clients.value);
}
function fetchClients(page = 1, c = 10) {
  const realm = localStorage.getItem("choosenRealm");
  const query = { page, c, realm };
  clientService
    .clients(query)
    .then((data) => {
      clients.value = data.clients;
      currentPage.value = page;
      lastPage.value = data.last_page;
      index.value++;
    })
    .catch((err) => {
      console.error(err)
    });
}

onMounted(() => {
  fetchClients();
});
</script>
