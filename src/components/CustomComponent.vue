<template>
  <div class="grid-stack-item">
    <div class="grid-stack-item-content">
      <div class="comp-card">
        <div class="mask"></div>
        <div class="name">{{ typeConvertToName }}</div>
        <div ref="container" class="container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import CustomButton from "./CustomButton.vue";
import { BFormInput } from "bootstrap-vue";

export default {
  props: ["type"],
  data() {
    return {
      typeDict: {
        button: "按钮",
        input: "文本框",
      },
    };
  },
  computed: {
    typeConvertToName() {
      return this.typeDict[this.type];
    },
  },
  created() {
    console.log(this.type);
    let component;
    /*
     * 需要支持的控件
     * 文本框(单行, 多行)
     * 复选框
     * 日期选择框
     * 单选按钮
     * 下拉框
     * 文件上传
     */
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

<style scoped>
.comp-card {
  /* box-shadow: 0 0 0.3rem 0.3rem #dddddd; */
  width: 100%;
  height: 100%;
  position: relative;
}

.name {
  border: 1px solid #dddddd;
  border-radius: 0.325rem;
  font-size: 0.85rem;
}

.container {
  /* display: flex; */
  /* padding: 4px; */
  width: 100%;
  /* height: 100%; */
}

.mask {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
}
</style>
