<template>
  <ModalBase
    :isOpen="dialog"
    :title="'Registro de Clientes'"
    :needsClose="false"
  >
    <v-card>
      <v-card-title>
        <span class="text-h6"> Registro de Clientes </span>
      </v-card-title>
      <v-card-subtitle>
        <span>Realize o registro do cliente.</span>
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col cols="6" v-if="props.object">
              <v-text-field
                :placeholder="'Id'"
                :label="'Id'"
                required
                variant="underlined"
                v-model="client.id"
                :disabled="true"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :rules="clientRules.required"
                :placeholder="'Nome'"
                :label="'Nome'"
                required
                variant="underlined"
                v-model="client.name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :placeholder="'Descrição'"
                :label="'Descrição'"
                variant="underlined"
                :rules="clientRules.required"
                required
                v-model="client.description"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :placeholder="'Key'"
                :label="'Key'"
                variant="underlined"
                :rules="clientRules.required"
                required
                v-model="client.key"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                :placeholder="'Secret'"
                :label="'Secret'"
                variant="underlined"
                :rules="clientRules.required"
                required
                v-model="client.secret"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                item-title="name"
                item-value="id"
                return-object
                :rules="clientRules.required"
                v-model="client.realm_id"
                :label="'Id reino'"
                :items="realms"
                variant="underlined"
              >
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                item-title="name"
                item-value="id"
                return-object
                v-model="client.roles"
                :label="'Cargos'"
                multiple
                :items="roles"
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
import { ref, onMounted, watch } from "vue";
import clientComp from "@/compositionAPI/clientComp";

const {
  client,
  sendPayload,
  realms,
  fetchRealms,
  getClient,
  appStore,
  fetchRoles,
  roles,
} = clientComp();

const form = ref(null);

const props = defineProps({
  dialog: Boolean,
  object: Object,
});

const clientRules = {
  required: [(v) => !!v || "Campo obrigatorio"],
};

watch(realms, (nw, old) => {
  if (nw && nw.length > 0) {
    if (props.object) {
      client.value.realm_id = realms.value.find(
        (i) => i.id == client.value.realm_id
      );
    }
  }
});

const emit = defineEmits("close");

onMounted(() => {
  try {
    fetchRealms();
    fetchRoles();
    if (!props.object) {
    } else {
      getClient(props.object.id);
    }
  } catch (error) {
    console.error(error);
  }
});

function closeDialog() {
  emit("close", false);
}

async function save() {
  const validated = await form.value.validate();
  try {
    const roles = client.value.roles
      ? client.value.roles.map((role) => {
          return role.id;
        })
      : [];
    client.value.roles = roles;
    if (validated.valid) {
      sendPayload(props.object ? props.object : false);
      closeDialog();
      const action = props.object ? "alterado" : "registrado";
      appStore.changeDialog({
        color: "green",
        message: `Item ${action} com sucesso!`,
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
