<template>
  <ModalBase
    :isOpen="dialog"
    :title="'Registro de Sessoes'"
    :needsClose="false"
  >
    <v-card>
      <v-card-title>
        <span class="text-h6"> Registro de Sessões </span>
      </v-card-title>
      <v-card-subtitle>
        <span>Realize o registro da sessão.</span>
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col cols="6">
              <v-text-field
                :placeholder="'Token'"
                :label="'Token'"
                :rules="sessionRules.required"
                variant="underlined"
                required
                v-model="session.token"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                item-title="username"
                item-value="id"
                return-object
                required
                :clearable="true"
                :rules="sessionRules.required"
                v-model="session.user_id"
                :label="'Id do usuário'"
                :items="users"
                variant="underlined"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
                <v-btn variant="text" type="submit"> Salvar </v-btn>
                <v-btn variant="text" @click="closeDialog"> Fechar </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </ModalBase>
</template>

<script setup>
import ModalBase from "@/components/modal/ModalBase.vue";
import { ref, onMounted } from "vue";
import sessionComp from "@/compositionAPI/sessionComp";

const {
  session,
  sendPayload,
  userList,
  users,
  fetchUsers,
  getSession,
  appStore,
} = sessionComp();

const form = ref(null);

const props = defineProps({
  dialog: Boolean,
  object: Object,
});

const emit = defineEmits("close");

onMounted(async () => {
  try {
    fetchUsers();
    if (!props.object) {
      console.log(props.object);
    } else {
      getSession(props.object.id);
    }
  } catch (error) {
    console.error(error);
  }
});

function closeDialog() {
  emit("close", false);
}
const sessionRules = {
  required: [(v) => !!v || "Campo obrigatorio"],
};

async function save() {
  const validated = await form.value.validate();
  try {
    if (validated.valid) {
      sendPayload(props.object ? props.object : false);
      closeDialog();
      const action = props.object ? "alterado" : "registrado";
      appStore.changeDialog({
        color: "green",
        message: `Sessão ${action} com sucesso!`,
        show: true,
      });
    } else {
      appStore.changeDialog({
        color: "red",
        message: "Preencha os campos!",
        show: true,
      });
    }
  } catch (error) {
    console.error(error);
    appStore.changeDialog({
      color: "red",
      message: error,
      show: true,
    });
  }
}
</script>

<style lang="scss" scoped></style>
