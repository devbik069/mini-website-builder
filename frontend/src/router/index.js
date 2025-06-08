import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import PageList from "@/views/Page.vue";
import PageEdit from "@/views/PageEdit.vue";
import PageCreate from "@/views/PageCreate.vue";
import Login from "@/views/Login.vue";
import { useAuthStore } from "@/store/auth";
import axios from "axios";

// Define the route configuration
const routes = [
  { path: "/admin", 
        meta: { requiresAuth: true },

    name: "Home", component: Home },
  { path: "/", redirect: "/login" },

  { path: "/login", name: "Login", component: Login },

  // All protected routes under /admin
  {
    path: "/admin",
    meta: { requiresAuth: true },
    children: [
      {
        path: "pages",
        name: "Pages",
        component: PageList,
      },
      {
        path: "pages/create",
        name: "PageCreate",
        component: PageCreate,
      },
      {
        path: "pages/:pageId",
        name: "Editor",
        component: PageEdit,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to check authentication before route change
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: "Login" });
  }

  if (auth.token && !auth.user) {
    try {
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });

      // Assign the authenticated user to the store
      auth.user = response.data;
    } catch (err) {
      console.warn("Token invalid, redirecting to login...");
      auth.clearToken();
      return next({ name: "Login" });
    }
  }

  next();
});

export default router;
