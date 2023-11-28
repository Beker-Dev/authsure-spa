<template>
  <ViewBase
    title="Auditoria de Sessões"
    createTitle="Nova Sessão"
    :objects="audits"
    :labels="['Id', 'Url', 'Método', 'Status', 'Sessão']"
    :keys="['id', 'url', 'method', 'status', 'session_id']"
    :modalEdit="modalEdit"
    :modalDelete="modalDelete"
    :onlyView="true"
    :modalInfo="modalInfo"
    @openManage="handleManage"
    :page="currentPage"
    :lastPage="lastPage"
    :key="index"
    @paginate="fetchAudits"
  />
</template>

<script setup>
import ViewBase from "@/components/ViewBase.vue";
import AuditService from "@/service/auditService.js";
import { ref } from "vue";
import baseComp from "@/compositionAPI/baseComp";

const { handleManage } = baseComp();

const auditService = new AuditService();
const index = ref(0);

const currentPage = ref(1);
const lastPage = ref(1);
const audits = ref([]);

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
    "Url",
    "Método",
    "Status",
    "Sessão",
    "Criada em",
    "Atualizada em",
  ],
  keys: [
    "id",
    "url",
    "method",
    "status",
    "session_id",
    "created_at",
    "updated_at",
  ],
};

function fetchAudits(page = 1, c = 10) {
  const realm = localStorage.getItem("choosenRealm");
  const query = { page, c, realm };
  auditService.audits(query).then((data) => {
    audits.value = data.audits;
    currentPage.value = page;
    lastPage.value = data.last_page;
    index.value++;
  });
}

fetchAudits();
</script>
