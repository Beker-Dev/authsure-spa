<template>
  <v-dialog
    v-model="openChangePass"
    max-width="400"
    @click:outside="closeModal"
    :persistent="true"
  >
    <v-card>
      <v-card-title> Recupere sua senha </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-col cols="12">
            <v-text-field
              :rules="userRules.emailRules"
              v-model="email"
              :label="'Email da conta'"
              :placeholder="'Email da conta'"
              :type="'email'"
            >
            </v-text-field>
          </v-col>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="green" @click="recover">Salvar</v-btn>
        <v-btn color="red" @click="closeModal">Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const emit = defineEmits("close");
import { useAppStore } from "@/store/app";
import { ref, watch } from "vue";
import UserService from "@/service/userService";

const appStore = useAppStore();

const userService = new UserService();

const props = defineProps({
  dialog: Boolean,
});
const email = ref("");

function closeModal() {
  openChangePass.value = false;
  clearFields();
  emit("close");
}
const form = ref(null);

const openChangePass = ref(false);

watch(
  () => props.dialog,
  (value) => {
    if (value) {
      clearFields();
      openChangePass.value = value;
    }
  }
);
const userRules = {
  emailRules: [
    (v) => !!v || "Campo obrigatorio",
    (v) =>
      !v ||
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      "E-mail inválido",
  ],
};

function clearFields() {
  email.value = "";
}

async function recover() {
  const validated = await form.value.validate();
  if (validated.valid) {
    userService
      .recoverUser({
        email: email.value,
      })
      .then((res) => {
        console.log(res)
        alert(res.data)
        closeModal();
      })
      .catch((err) => {
        console.log(err);
        appStore.changeDialog({
          color: "red",
          message: err,
          show: true,
        });
      });
  }
}
</script>

<style lang="scss" scoped></style>
