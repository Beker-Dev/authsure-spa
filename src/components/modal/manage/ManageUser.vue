<template>
  <ModalBase :isOpen="dialog" :title="'Registro de Reino'" :needsClose="false">
    <v-card>
      <v-card-title>
        <span class="text-h6"> Registro de Usuario </span>
      </v-card-title>
      <v-card-subtitle>
        <span>Realize o registro de usuario.</span>
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" @submit.prevent="save">
          <v-row>
            <v-col :cols="'6'">
              <v-text-field
                :rules="userRules.required"
                :placeholder="'Nome'"
                :label="'Nome'"
                required
                variant="underlined"
                v-model="user.username"
              >
              </v-text-field>
            </v-col>
            <v-col :cols="'6'" v-if="!props.object">
              <v-text-field
                :rules="userRules.password"
                :placeholder="'Senha'"
                :append-icon="'mdi-lock-reset'"
                @click:append="randomPass"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:appendInner="hideAndShowPassword"
                :label="'Senha'"
                :type="showPassword ? 'text' : 'password'"
                required
                variant="underlined"
                counter
                :min="'8'"
                :max="'255'"
                v-model="user.password"
              >
              </v-text-field>
            </v-col>
            <v-col :cols="'6'">
              <v-text-field
                :rules="userRules.emailRules"
                :placeholder="'Email'"
                :label="'Email'"
                required
                type="email"
                variant="underlined"
                v-model="user.email"
              >
              </v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select
                item-title="name"
                item-value="id"
                return-object
                :disabled="true"
                :rules="userRules.required"
                v-model="user.realm_id"
                :label="'Reino'"
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
                v-model="user.roles"
                :label="'Cargos'"
                multiple
                :items="roles"
                variant="underlined"
              >
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                item-title="name"
                item-value="id"
                return-object
                v-model="user.groups"
                :label="'Grupos'"
                multiple
                :items="groups"
                variant="underlined"
              >
              </v-select>
            </v-col>
            <v-col cols="12" v-if="props.object">
              <span @click="openChangePassword"
                ><a href="#">Trocar senha</a></span
              >
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
    <ChangePassword
      v-if="props.object"
      :id="props.object.id"
      @close="openChangePassword"
      :dialog="openChangePass"
    ></ChangePassword>
  </ModalBase>
</template>

<script setup>
const emit = defineEmits("close");
import ModalBase from "@/components/modal/ModalBase.vue";
import userComp from "@/compositionAPI/userComp";
import ChangePassword from "@/components/modal/ChangePassword.vue";

const {
  user,
  sendPayload,
  appStore,
  realms,
  fetchRealms,
  fetchRoles,
  roles,
  groups,
  fetchGroups,
} = userComp();
import { ref, onMounted, watch } from "vue";
const form = ref(null);
const props = defineProps({
  dialog: Boolean,
  object: Object,
});
const openChangePass = ref(false);

const showPassword = ref(false);

watch(realms, (nw, old) => {
  if (nw && nw.length > 0) {
    if (user.value.realm_id)
      user.value.realm_id = realms.value.find(
        (i) => i.id == user.value.realm_id
      );
  }
});

const userRules = {
  required: [(v) => !!v || "Campo obrigatorio"],
  password: [
    (v) => !!v || "Campo obrigatorio",
    (v) => v.length >= 8 || "Senha mínima deve possuir 8 caracteres",
  ],
  emailRules: [
    (v) => !!v || "Campo obrigatorio",
    (v) =>
      !v ||
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
      "E-mail inválido",
  ],
};

onMounted(() => {
  fetchRealms();
  fetchGroups();
  fetchRoles();
  if (props.object) {
    user.value = { ...props.object };
  }
});

function closeDialog(e = null) {
  emit("close", e);
}
function hideAndShowPassword() {
  showPassword.value = !showPassword.value;
}
function openChangePassword(e) {
  openChangePass.value = !openChangePass.value;
}
function randomPass() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let senha = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    senha += caracteres.charAt(randomIndex);
  }
  console.log(senha);
  user.value.password = senha;
}
async function save() {
  try {
    const validated = await form.value.validate();
    if (validated.valid) {
      const roles = user.value.roles
        ? user.value.roles.map((role) => {
            return role.id;
          })
        : [];
      const groups = user.value.groups
        ? user.value.groups.map((group) => {
            return group.id;
          })
        : [];

      user.value.roles = roles;
      user.value.groups = groups;
      const data = sendPayload(props.object ? true : false);

      closeDialog(data);
      const action = props.object ? "alterado" : "registrado";
      appStore.changeDialog({
        color: "green",
        message: `Cargo ${action} com sucesso!`,
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
