<template>
  <div :key="attTable">
    <ViewBase
      title="Grupos"
      createTitle="Novo Grupo"
      :objects="groups"
      :labels="['Id', 'Nome']"
      :keys="['id', 'name']"
      :modalEdit="modalEdit"
      :modalDelete="modalDelete"
      :modalInfo="modalInfo"
      :page="currentPage"
      :lastPage="lastPage"
      :key="index"
      @openManage="handleManage"
      @edit="callEdit"
      @delete="callDelete"
      @paginate="fetchGroups"
    />
  </div>
  <ManageGroup
    :dialog="dialog"
    :object="object"
    v-if="dialog"
    @close="closeDialog($event, fetchGroups)"
  ></ManageGroup>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import ManageGroup from "@/components/modal/manage/ManageGroup.vue";
import GroupService from "@/service/groupService.js";
import { ref, watch } from "vue";
import baseComp from "@/compositionAPI/baseComp";

const {
  object,
  dialog,
  appStore,
  attTable,
  handleManage,
  callEdit,
  callDeleteBase,
  closeDialog,
} = baseComp();

const groupService = new GroupService();
const index = ref(0);
const currentPage = ref(1);
const lastPage = ref(1);
const groups = ref([]);

function callDelete(e) {
  groups.value = callDeleteBase(e, groupService, groups.value);
}

const modalEdit = {
  title: "Editar Grupo",
};

const modalDelete = {
  title: "Deletar Grupo",
};

const modalInfo = {
  title: "Informações do Grupo",
  labels: ["Id", "Nome", "Realm", "Cargos", "Criado em", "Atualizado em"],
  keys: ["id", "name", "realm", "roles", "created_at", "updated_at"],
};

function fetchGroups(page = 1, c = 10) {
  const realm = localStorage.getItem("choosenRealm");
  const query = { page, c, realm };
  groupService
    .groups(query)
    .then((data) => {
      groups.value = data.groups;
      currentPage.value = page;
      lastPage.value = data.last_page;
      index.value++;
    })
    .catch((error) => {
      console.error(error);
    });
  attTable.value = 1;
}

fetchGroups();
</script>
