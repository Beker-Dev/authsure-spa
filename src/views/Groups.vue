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
    @close="closeDialog"
  ></ManageGroup>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import ManageGroup from "@/components/modal/manage/ManageGroup.vue";
import GroupService from "@/service/groupService.js";
import { ref, watch } from "vue";
import baseComp from "@/compositionAPI/baseComp";

const { object, dialog, attTable, handleManage, callEdit } = baseComp();

const groupService = new GroupService();
const index = ref(0);
const currentPage = ref(1);
const lastPage = ref(1);
const groups = ref([]);

function closeDialog(e) {
  dialog.value = false;
  object.value = null;
  fetchGroups();
}

function callDelete(e) {
  console.log(e);
  try {
    if (e) {
      groupService.delete(e);
      groups.value = groups.value.filter((i) => i.id !== e);
    }
  } catch (error) {
    console.error(error);
  }
}

const modalEdit = {
  title: "Editar Grupo",
};

const modalDelete = {
  title: "Deletar Grupo",
};

const modalInfo = {
  title: "Informações do Grupo",
  labels: ["Id", "Nome", "Criado em", "Atualizado em"],
  keys: ["id", "name", "created_at", "updated_at"],
};

function fetchGroups(page = 1, c = 10) {
  const realm = "AuthSure";
  const query = {page, c, realm}
  groupService.groups(query).then((data) => {
    groups.value = data.groups;
    currentPage.value = page;
    lastPage.value = data.last_page;
    index.value++;
  });
  attTable.value = 1;
}

fetchGroups();
</script>
