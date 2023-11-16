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
    @close="closeDialog"
  ></ManageUser>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import ManageUser from "@/components/modal/manage/ManageUser.vue";
import UserService from "@/service/userService.js";
import { ref, watch } from "vue";
import baseComp from "@/compositionAPI/baseComp";

const { object, dialog, attTable, handleManage, callEdit } = baseComp();

const userService = new UserService();
const index = ref(0);
const currentPage = ref(1);
const lastPage = ref(1);
const users = ref([]);



function closeDialog(e) {
  dialog.value = false;
  object.value = null;
  fetchUsers();
}

function callDelete(e) {
  console.log(e);
  try {
    if (e) {
      userService.delete(e);
      users.value = users.value.filter((i) => i.id !== e);
    }
  } catch (error) {
    console.error(error);
  }
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
    "Criado em",
    "Atualizado em",
  ],
  keys: ["id", "username", "email", "realm_id", "created_at", "updated_at"],
};

function fetchUsers(page = 1, c = 10) {
  const realm = "AuthSure";
  const query = {page, c, realm}
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
