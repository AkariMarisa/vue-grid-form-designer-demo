import VueRouter from "vue-router";
import Index from "@/view/Index.vue";
import Test from "@/view/Test.vue";
import Vue from "vue";

Vue.use(VueRouter);

export const routes = [
  { path: "/", component: Index },
  { path: "/test", component: Test },
];

const router = new VueRouter({
  routes,
});

export default router;
