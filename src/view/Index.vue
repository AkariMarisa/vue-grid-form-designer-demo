<template>
  <div class="container">
    <div class="trash">
      <b-icon icon="trash" scale="2" />
      <span style="margin-top: 1rem;">请拖拽到此处删除</span>
    </div>

    <div class="toolbar">
      <b-button @click="addItem">Add item</b-button>
      <b-button @click="addItemNew">Add item New</b-button>
      <b-button @click="dumpItems">Dump items</b-button>
    </div>

    <div class="log-area">
      <b-textarea v-model="itemsString" rows="10" readonly></b-textarea>
    </div>

    <div class="grid">
      <div class="grid-stack">
      </div>
    </div>

    <!-- 右边的弹出控件菜单 -->
    <div class="components-menu">
      <label class="components-menu-toggle" for="menu-toggle">
        <b-icon icon="chevron-left"></b-icon>
      </label>
      <input type="checkbox" class="toggle-ckb" id="menu-toggle" />

      <div class="components-menu-list">
        <div
          class="component-row"
          v-for="n in 15"
          :key="n"
          draggable="true"
          unselectable="on"
        >
          <custom-component :type="n % 2 === 1 ? 'input' : 'button'" />
        </div>
      </div>
    </div>

    <div class="block"></div>
  </div>
</template>

<script>
import { GridStack } from "gridstack";
import CustomComponent from "@/components/CustomComponent.vue";

import "gridstack/dist/gridstack.min.css";
import "gridstack/dist/h5/gridstack-dd-native";
import "gridstack/dist/gridstack-extra.css";
import Vue from "vue";

export default {
  components: { CustomComponent },
  data() {
    return {
      gridEl: null,
      itemsString: "",
      count: 0,
      widgetsList: [
        { text: "Vegetables", width: "2", height: "2", title: "one" },
        { text: "Cheese", width: "2", height: "4", title: "two" },
        {
          text: "Whatever else humans are supposed to eat",
          width: "4",
          height: "2",
          title: "three",
        },
      ],
    };
  },
  mounted() {
    this.initGridStack();
  },
  methods: {
    initGridStack() {
      let grid = GridStack.init({
        acceptWidgets: true,
        float: false,
        cellHeight: "5rem",
        column: 2,
        dragIn: ".components-menu-list .component-row .grid-stack-item",
        dragInOptions: {
          helper: "clone",
        },
        minRow: 1,
        removable: ".trash",
      });

      this.gridEl = grid;

      let that = this;

      grid.on("dragstart", function(e, el) {
        console.log(e, el);
        document.getElementsByClassName("trash")[0].classList.add("show");
      });
      grid.on("dragstop", function(e, el) {
        console.log(e, el);
        document.getElementsByClassName("trash")[0].classList.remove("show");
      });
      grid.on("dropped", function(e, previousWidget, newWidget) {
        console.log(
          "Removed widget that was dragged out of grid:",
          previousWidget
        );
        console.log("Added widget in dropped grid:", newWidget);
        if (newWidget) {
          // 添加了新控件
          // 为每个控件绑定一个点击事件
          newWidget.el.onclick = function() {
            console.log("element clicked");
          };

          that.addItemNew();
        }
      });
    },
    addItem() {
      const comp = Vue.extend(CustomComponent);
      const b = new comp({ propsData: { type: "button" } });
      b.$mount();

      this.gridEl.addWidget(b.$el, { w: 1, h: 1 });
    },
    addItemNew() {
      this.widgetsList.push({
        text: "Cheese",
        width: "2",
        height: "4",
        title: "two",
      });
    },
    dumpItems() {
      const items = this.gridEl.save();
      this.itemsString = JSON.stringify(items);
    },
  },
};
</script>

<style>
.grid-stack > .grid-stack-item > .grid-stack-item-content {
  display: flex;
}
</style>

<style scoped>
.container {
  width: 85%;
}

.trash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 0;
  background-color: #f37d7d;
  transition: height 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.trash.show {
  height: 5rem;
}

.toolbar,
.grid {
  margin: 0.725rem;
}

.grid {
  min-height: 20rem;
  border-radius: 1rem;
  box-shadow: 0 0 1rem 0.5rem #dddddd;
}

.components-menu {
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
}

.components-menu-toggle {
  max-height: 1.8rem;
  background-color: violet;
  border-radius: 2rem 0 0 2rem;
  cursor: pointer;
  /* padding-right: 0.5rem; */
  z-index: 2;
}

.components-menu-toggle::after {
  content: "Open";
  padding-right: 1rem;
}

.toggle-ckb {
  display: none;
}

.components-menu-list {
  max-width: 0;
  height: 100vh;
  background-color: #fff;
  transition: max-width ease-in 0.1s;
  overflow-x: hidden;
}

.toggle-ckb:checked + .components-menu-list {
  max-width: 15rem;
  box-shadow: 0 0 0.5rem 0.2rem #cccccc;
}

.component-row {
  margin: 0.5rem;
  cursor: move;
}

.component-row > * {
  width: 14rem;
}
</style>
