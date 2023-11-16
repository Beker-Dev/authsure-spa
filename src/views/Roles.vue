<template>
  <div :key="attTable">
    <ViewBase
      title="Cargos"
      createTitle="Novo Cargo"
      :objects="roles"
      :labels="['Id', 'Nome']"
      :keys="['id', 'name']"
      :modalEdit="modalEdit"
      :modalDelete="modalDelete"
      :modalInfo="modalInfo"
      :page="currentPage"
      :lastPage="lastPage"
      @openManage="handleManage"
      :key="index"
      @edit="callEdit"
      @delete="callDelete"
      @paginate="fetchRoles"
    />
  </div>

  <ManageRoles
    v-if="dialog"
    :dialog="dialog"
    :object="object"
    @close="closeDialog"
  ></ManageRoles>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import ManageRoles from "@/components/modal/manage/ManageRoles.vue";
import Roleservice from "@/service/roleService.js";
import { ref, watch } from "vue";
import baseComp from "@/compositionAPI/baseComp";

const { object, dialog, attTable, handleManage, callEdit } = baseComp();
const roleservice = new Roleservice();
const index = ref(0);
const currentPage = ref(1);
const lastPage = ref(1);

const roles = ref([]);



const modalEdit = {
  title: "Editar Cargo",
};

const modalDelete = {
  title: "Deletar Cargo",
};

function closeDialog(e) {
  dialog.value = false;
  object.value = null;
  fetchRoles();
}

function callDelete(e) {
  console.log(e);
  try {
    if (e) {
      roleservice.delete(e);
      roles.value = roles.value.filter((i) => i.id !== e);
    }
  } catch (error) {
    console.error(error);
  }
}

const modalInfo = {
  title: "Informações do Cargo",
  labels: ["Id", "Nome", "Criado em", "Atualizado em"],
  keys: ["id", "name", "created_at", "updated_at"],
};

function fetchRoles(page = 1, c = 10) {
  const realm = "AuthSure";
  const query = {page, c, realm}
  roleservice.roles(query).then((data) => {
    roles.value = data.roles;
    currentPage.value = page;
    lastPage.value = data.last_page;
    index.value++;
  });
  attTable.value = 1;
}

fetchRoles();
</script>
