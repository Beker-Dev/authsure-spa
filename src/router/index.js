// Composables
import { createRouter, createWebHistory } from "vue-router";
import { useAppStore } from "@/store/app";
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "/clients",
        name: "clients",
        component: () => import("@/views/Clients.vue"),
      },
      {
        path: "/realms",
        name: "realms",
        component: () => import("@/views/Realms.vue"),
      },
      {
        path: "/roles",
        name: "roles",
        component: () => import("@/views/Roles.vue"),
      },
      {
        path: "/users",
        name: "users",
        component: () => import("@/views/Users.vue"),
      },
      {
        path: "/groups",
        name: "groups",
        component: () => import("@/views/Groups.vue"),
      },
      {
        path: "/sessions",
        name: "sessions",
        component: () => import("@/views/Sessions.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: `login`,
    component: () => import("@/views/Login.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((to, from, next) => {
  if (localStorage.getItem("auth")) {
    const parse = JSON.parse(localStorage.getItem("auth"));
    if (parse) {
      const hasChoosenRealm = localStorage.getItem("choosenRealm");
      
      if (!hasChoosenRealm && to.name != "realms") {
        const appStore = useAppStore();
        appStore.changeDialog({
          color: "red",
          message: "Selecione um reino para ter acesso a isso.",
          show: true,
        });
        next({ path: "/realms" });
      } else {
        next();
      }
    }
  } else {
    console.log('foi pro login', from)
    if(to.name == "login")
      next()
    next({ name: "login" })
  }
});

export default router;
