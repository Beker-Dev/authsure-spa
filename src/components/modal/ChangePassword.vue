<template>
  <v-dialog
    v-model="openChangePass"
    max-width="400"
    @click:outside="closeModal"
    :persistent="true"
  >
    <v-card>
      <v-card-title> Troque a senha do usuario </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-col cols="12">
            <v-text-field
              :rules="userRules.oldpass"
              v-model="password"
              :label="'Senha atual'"
              :placeholder="'Senha atual'"
              :type="'password'"
            >
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              :rules="userRules.newpass"
              v-model="newPass"
              :label="'Nova senha'"
              :placeholder="'Nova senha'"
              :type="'password'"
            >
            </v-text-field>
          </v-col>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="green" @click="saveNewPassword">Salvar</v-btn>
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
  id: Number,
});

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
  oldpass: [
    (v) => !!v || "Campo obrigatorio",
    (v) => v.length >= 8 || "Senha mínima deve possuir 8 caracteres",
  ],

  newpass: [
    (v) => !!v || "Campo obrigatorio",
    (v) => v.length >= 8 || "Senha mínima deve possuir 8 caracteres",
    (v) => v != password.value || "Senhas são iguais",
  ],
};

function clearFields() {
  password.value = "";
  newPass.value = "";
}

async function saveNewPassword() {
  const validated = await form.value.validate();
  if (validated.valid) {
    userService
      .changePassword(
        {
          old_password: password.value,
          new_password: newPass.value,
        },
        props.id
      )
      .then((res) => {
        appStore.changeDialog({
          color: "green",
          message: `Senha de ${res.data.username} alterada com sucesso ! `,
          show: true,
        });
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
const newPass = ref("");
const password = ref("");
</script>

<style lang="scss" scoped></style>
