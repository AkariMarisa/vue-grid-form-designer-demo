<template>
  <div>
      <TestComponent />
  </div>
</template>
<script>
import TestComponent from './TestComponent.vue';
export default {
  components: {TestComponent},
  data() {
    return {
      dragHeight: 0,
    };
  },
  methods: {
    dragstart(e) {
      // console.log(e, e.target.offsetHeight);
      this.dragHeight = e.target.offsetHeight + "px";

      console.log(this.$el.children);
    },
    drop(e) {
      console.log("drop", e);
    },
    dragover(e) {
      // if (e.target.className === "item") {
      // console.log("drag over", e, e.target);
      const children = e.target.children;
      for (const child of children) {
        if (child.className === "placeholder") {
          child.style.height = this.dragHeight;
          break;
        }
      }
      // }
    },
    dragleave(e) {
      // if (e.target.className === "item") {
      console.log("dragleave", e);
      const children = e.target.children;
      for (const child of children) {
        if (child.className === "placeholder") {
          child.style.height = 0;
          break;
        }
      }
      // }
    },
  },
};
</script>
