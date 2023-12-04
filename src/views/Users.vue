<template>
  <ViewBase
    title="Usuários"
    createTitle="Novo Usuário"
    :objects="users"
    :labels="['Id', 'Nome de usuário', 'Email']"
    :keys="['id', 'username', 'email']"
    :modalEdit="modalEdit"
    :modalDelete="modalDelete"
    :modalInfo="modalInfo"
    :page="currentPage"
    :lastPage="lastPage"
    :key="index"
    @openManage="handleManage"
    @edit="callEdit"
    @delete="callDelete"
    @paginate="fetchUsers"
  />
  <ManageUser
    v-if="dialog"
    :dialog="dialog"
    :object="object"
    @close="callClose($event)"
  ></ManageUser>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import ManageUser from "@/components/modal/manage/ManageUser.vue";
import UserService from "@/service/userService.js";
import { ref, watch } from "vue";
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

const userService = new UserService();
const index = ref(0);
const currentPage = ref(1);
const lastPage = ref(1);
const users = ref([]);

function callDelete(e) {
  users.value = callDeleteBase(e, userService, users.value);
}

function callClose(e) {
  closeDialog(e, fetchUsers);
}
const modalEdit = {
  title: "Editar Usuário",
};

const modalDelete = {
  title: "Deletar Usuário",
};

const modalInfo = {
  title: "Informações do Usuário",
  labels: [
    "Id",
    "Nome de usuário",
    "Email",
    "Reino",
    "Grupos",
    "Cargos",
    "Criado em",
    "Atualizado em",
  ],
  keys: [
    "id",
    "username",
    "email",
    "realm",
    "groups",
    "roles",
    "created_at",
    "updated_at",
  ],
};

function fetchUsers(page = 1, c = 10) {
  const realm = localStorage.getItem("choosenRealm");
  const query = { page, c, realm };
  userService.users(query).then((data) => {
    users.value = data.users;
    currentPage.value = page;
    lastPage.value = data.last_page;
    index.value++;
  });
  attTable.value = 1;
}

fetchUsers();
</script>
