<template>
  <v-app-bar color="gray" absolute>
    <v-app-bar-nav-icon
      variant="text"
      @click="expandNavBar = expandNavBar ? false : true"
    >
    </v-app-bar-nav-icon>
    <v-app-bar-title> AuthSure </v-app-bar-title>
    <v-btn variant="text" size="large" icon="mdi-help-circle-outline"></v-btn>
    <v-btn
      variant="text"
      size="large"
      icon="mdi-account-circle-outline"
    ></v-btn>
    <v-btn
      variant="text"
      size="large"
      @click="logOutUser"
      icon="mdi-exit-to-app"
      color="red"
    >
    </v-btn>
  </v-app-bar>
  <v-navigation-drawer
    v-model="expandNavBar"
    :temporary="smAndDown ? true : false"
    :permanent="smAndDown ? false : true"
  >
    <v-list density="compact">
      <v-list>
        <v-list-item title="admin">
          <template v-slot:prepend>
            <v-icon size="large" icon="mdi-account-circle-outline"></v-icon>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list-subheader class="text-subtitle-1 mt-4">Manage</v-list-subheader>
      <v-divider class="mt-3"></v-divider>
      <v-list-item
        v-for="(item, i) in definedRealm ? items : items.slice(0, 1)"
        :key="i"
        :value="item"
        :to="item.link"
        color="teal-lighten-3"
        class="mt-4"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <template v-slot:title>
          <p>{{ item.text }}</p>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { authUserStore } from "@/store/authStore/authStore";
import { useAppStore } from "@/store/app";
import { useRouter } from "vue-router";
const authApp = authUserStore();
const { smAndDown } = useDisplay();
const userouter = useRouter();
const appStore = useAppStore();
const definedRealm = computed(() => {
  return appStore.getChoosenRealm;
});
const expandNavBar = ref(true);
const items = ref([
  {
    text: "Realm",
    icon: "mdi-account-hard-hat",
    link: "/realms",
  },
  {
    text: "Clients",
    icon: "mdi-application-brackets-outline",
    link: "/clients",
  },

  {
    text: "Roles",
    icon: "mdi-account-hard-hat",
    link: "/roles",
  },
  {
    text: "Users",
    icon: "mdi-account-cog",
    link: "/users",
  },
  {
    text: "Groups",
    icon: "mdi-account-group",
    link: "/groups",
  },
  {
    text: "Sessions",
    icon: "mdi-sitemap-outline",
    link: "/sessions",
  },
  {
    text: "Auditoria",
    icon: "mdi-eye-circle-outline",
    link: "/audits",
  },
  // {
  //   text: "Events",
  //   icon: "mdi-post-outline",
  //   link: "/events",
  // },
]);

async function logOutUser() {
  try {
    await authApp.logOut();
    userouter.push({ name: "login" });
  } catch (error) {
    console.error(error);
  }
}
</script>
<style scoped>
.items {
  padding-left: 10px !important;
}
</style>
