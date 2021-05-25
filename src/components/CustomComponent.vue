<template>
  <div style="width: 100%; height: 100%; position: relative;">
    <div ref="container" style="width: 100%; height: 100%; position: absolute; z-index: -1;"></div>
  </div>
</template>

<script>
import Vue from "vue";
import CustomButton from './CustomButton.vue';
import { BFormInput } from "bootstrap-vue";

export default {
  props: ["type"],
  data() {
    return {};
  },
  created() {
    console.log(this.type);
    let component;
    switch (this.type) {
      case "button":
        component = this.createButton();
        break;
      case "input":
        component = this.createInput();
        break;
      default:
        console.warn("empty tag is not recommand");
        component = null;
        break;
    }

    if (component) {
      this.mountToRoot(component);
    }
  },
  methods: {
    mountToRoot(component) {
      component.$mount();
      this.$nextTick(() => {
        this.$refs.container.appendChild(component.$el);
      });
    },
    createButton() {
      let Button = Vue.extend(CustomButton);
      return new Button({ propsData: { content: "button" } });
    },
    createInput() {
      let Input = Vue.extend(BFormInput);
      return new Input({ propsData: { placeholder: "testing input" } });
    },
  },
};
</script>
