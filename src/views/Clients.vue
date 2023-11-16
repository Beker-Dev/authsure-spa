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
import clientComp from "@/compositionAPI/clientComp";
import { ref } from "vue";
import baseComp from "@/compositionAPI/baseComp";

const { object, dialog, handleManage, callEdit, callDeleteBase, closeDialog } =
  baseComp();

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
    "Descrição",
    "Criado em",
    "Atualizado em",
  ],
  keys: [
    "id",
    "name",
    "key",
    "secret",
    "realm_id",
    "description",
    "created_at",
    "updated_at",
  ],
};

function callDelete(e) {
  clients.value = callDeleteBase(e, clientService, clients.value);
}
function fetchClients(page = 1, c = 10) {
  const realm = "AuthSure";
  const query = { page, c, realm };
  clientService.clients(query).then((data) => {
    clients.value = data.clients;
    currentPage.value = page;
    lastPage.value = data.last_page;
    index.value++;
  });
}

fetchClients();
</script>
