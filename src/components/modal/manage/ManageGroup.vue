<template>
  <ModalBase :isOpen="dialog" :title="'Registro de Reino'" :needsClose="false">
    <v-card>
      <v-card-title>
        <span class="text-h6"> Registro de Grupo </span>
      </v-card-title>
      <v-card-subtitle>
        <span>Realize o registro de grupo.</span>
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col :cols="'6'">
              <v-text-field
                :rules="groupRules.required"
                :placeholder="'Nome'"
                :label="'Nome'"
                required
                variant="underlined"
                v-model="group.name"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                item-title="name"
                item-value="id"
                return-object
                :rules="groupRules.required"
                v-model="group.realm_id"
                :label="'Id reino'"
                :items="realms"
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
import groupComp from "@/compositionAPI/groupComp";

const { group, sendPayload, appStore, realms, fetchRealms } = groupComp();
import { ref, onMounted, watch } from "vue";
const form = ref(null);

const props = defineProps({
  dialog: Boolean,
  object: Object,
});

watch(realms, (newValue, oldValue) => {
  if (newValue.length > 0 && props.object) {
    group.value.realm_id = newValue.filter((i) => i.id == group.value.realm_id)[0];
  }
});

const groupRules = {
  required: [(v) => !!v || "Campo obrigatorio"],
};

onMounted(() => {
  fetchRealms();
  if (props.object) {
    group.value = { ...props.object };
  }
});

const emit = defineEmits("close");

function closeDialog(e) {
  emit("close");
}
async function save() {
  try {
    const validated = await form.value.validate();
    if (validated.valid) {
      sendPayload(props.object ? true : false);
      closeDialog();
      const action = props.object ? "alterado" : "registrado";
      appStore.changeDialog({
        color: "green",
        message: `Grupo ${action} com sucesso!`,
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
    appStore.changeDialog({
      color: "red",
      message: error,
      show: true,
    });
    console.error(error);
  }
}
</script>

<style lang="scss" scoped></style>
