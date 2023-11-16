<template>
  <div :key="attTable">
    <ViewBase
      title="Reinos"
      createTitle="Novo Reino"
      :objects="realms"
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
      @paginate="fetchRealms"
    />
  </div>

  <ManageRealm
    v-if="dialog"
    :dialog="dialog"
    :object="object"
    @close="closeDialog($event, fetchRealms)"
  ></ManageRealm>
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import RealmService from "@/service/realmService.js";
import ManageRealm from "@/components/modal/manage/ManageRealm.vue";
import baseComp from "@/compositionAPI/baseComp";

const { object, dialog, attTable, handleManage, callEdit, callDeleteBase, closeDialog } = baseComp();
import { ref } from "vue";

const realmService = new RealmService();
const index = ref(0);
const currentPage = ref(1);
const lastPage = ref(1);
const realms = ref([]);

const modalEdit = {
  title: "Editar Reino",
};

const modalDelete = {
  title: "Deletar Reino",
};

const modalInfo = {
  title: "Informações do Reino",
  labels: ["Id", "Nome", "Criado em", "Atualizado em"],
  keys: ["id", "name", "created_at", "updated_at"],
};

function fetchRealms(page = 1, c = 10) {
  const query = {page, c}
  realmService.realms(query).then((data) => {
    realms.value = data.realms;
    currentPage.value = page;
    lastPage.value = data.last_page;
    index.value++;
  });
}


function callDelete(e) {
  realms.value = callDeleteBase(e, realmService, realms.value);
}

fetchRealms();
</script>
