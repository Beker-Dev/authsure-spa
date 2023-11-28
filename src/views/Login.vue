<template>
  <v-container class="fill-height d-flex justify-center align-baseline">
    <v-row align-content="center" class="main mt-10">
      <v-col cols="12" class="d-flex justify-center">
        <h1 class="text-lg-h2 text-h3">AuthSure Demo</h1>
      </v-col>
      <v-col cols="12" class="aling-center mt-14">
        <v-card color="white" elevation="5" rounded>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="d-flex justify-center">
                <h1 class="text-black text-h4">Log in</h1>
              </v-col>
              <v-col cols="12">
                <v-form ref="form" @submit.prevent="goLogin">
                  <v-row>
                    <v-col cols="12" class="mt-3">
                      <v-text-field
                        label="Username"
                        placeholder="user"
                        type="text"
                        v-model="loginPayload.username"
                        :rules="userRules.username"
                        variant="underlined"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        label="Password"
                        placeholder="Password"
                        type="password"
                        variant="underlined"
                        :rules="userRules.password"
                        v-model="loginPayload.password"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                      <v-btn
                        color="transparent"
                        @click="openRecoverPassword = true"
                        density="compact"
                        elevation="0"
                        >Forgot Password</v-btn
                      >
                    </v-col>
                    <v-col cols="12">
                      <v-btn type="submit" block color="blue"> Log in </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <recover-password
      :dialog="openRecoverPassword"
      @close="openRecoverPassword = false"
    ></recover-password>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import userComp from "../compositionAPI/userComp";
import { useRouter } from "vue-router";
import getAuth from "@/utils/auth";
import RecoverPassword from "@/components/modal/RecoverPassword.vue";

onMounted(() => {
  console.log("mounted");
});

const loginPayload = ref({
  username: "",
  password: "",
});

const openRecoverPassword = ref(false);

const form = ref(null);

const { login, userRules } = userComp();

async function goLogin() {
  try {
    const validated = await form.value.validate();
    if (!validated.valid) return;
    await login({
      ...loginPayload.value,
      key: import.meta.env.VITE_CLIENT_KEY,
      secret: import.meta.env.VITE_CLIENT_SECRET,
    });
  } catch (er) {
    throw er;
  }
}

(function authCheck() {
  const auth = getAuth();
  if (auth) {
    const userouter = useRouter();
    userouter.push({ name: "Home" });
  }
})();
</script>
<style scoped>
.main {
  display: flex !important;
  justify-content: center !important;
  max-width: 83vh !important;
}
.bg {
  background-color: rgb(141, 139, 139) !important;
}
.container {
  height: 80vh !important;
  display: flex !important;
}
</style>
