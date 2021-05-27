import VueRouter from "vue-router";
import Index from "@/view/Index.vue";
import Vue from "vue";

Vue.use(VueRouter);

export const routes = [
  { path: "/", component: Index },
];

const router = new VueRouter({
  routes,
});

export default router;
