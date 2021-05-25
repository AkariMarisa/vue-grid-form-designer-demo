<template>
  <div>
    <div class="view">
      <div class="toolbar">
        <b-button @click="addItem">Add row</b-button>
      </div>
      <div class="grid" id="content">
        <grid-layout
          ref="gridlayout"
          :layout.sync="layout"
          :col-num="2"
          :row-height="40"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[10, 10]"
          :use-css-transforms="true"
        >
          <grid-item
            v-for="item in layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i"
            :isResizable="true"
          >
            <!-- {{ item.i }} -->
            <!-- <b-form-input placeholder="Enter email" required></b-form-input> -->
            <custom-component :type="item.type"></custom-component>
          </grid-item>
        </grid-layout>
      </div>
    </div>

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
          @dragstart="dragstart"
          @drag="debouncingDrag"
          @dragend="dragend"
          draggable="true"
          unselectable="on"
          :component-type="n % 2 === 1 ? 'input' : 'button'"
        >
          <div class="mask"></div>
          <b-form-input v-if="n % 2 === 1" placeholder="input"></b-form-input>
          <b-button v-else>button</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import { BFormInput } from "bootstrap-vue";
import CustomComponent from "./components/CustomComponent.vue";

let mouseXY = { x: null, y: null };
let DragPos = { x: null, y: null, w: 1, h: 1, i: null };

export default {
  components: { GridLayout, GridItem, CustomComponent },
  props: [],
  data() {
    return {
      itemIndex: 10,
      layout: [
        { x: 0, y: 0, w: 1, h: 1, i: "0", type: "input" },
        { x: 0, y: 1, w: 1, h: 1, i: "1", type: "button" },
        { x: 0, y: 2, w: 1, h: 1, i: "2", type: "input" },
        { x: 0, y: 3, w: 1, h: 1, i: "3", type: "button" },
        { x: 0, y: 4, w: 1, h: 1, i: "4", type: "input" },
        { x: 0, y: 5, w: 1, h: 1, i: "5", type: "button" },
        { x: 0, y: 6, w: 1, h: 1, i: "6", type: "input" },
        { x: 0, y: 7, w: 1, h: 1, i: "7", type: "button" },
        { x: 0, y: 8, w: 1, h: 1, i: "8", type: "input" },
        { x: 0, y: 9, w: 1, h: 1, i: "9", type: "button" },
      ],
      dragData: null,
      dragTask: null,
      components: {
        input: BFormInput,
      },
    };
  },
  mounted() {
    document.addEventListener("dragover", this.mouseDrag);
  },
  beforeDestroy() {
    document.removeEventListener("dragover", this.mouseDrag);
  },
  methods: {
    mouseDrag(e) {
      mouseXY.x = e.clientX;
      mouseXY.y = e.clientY;
    },
    addItem() {
      this.layout.push({
        x: 0,
        y: this.layout.length, // puts it at the bottom
        w: 1,
        h: 1,
        i: this.itemIndex,
      });

      this.itemIndex++;
    },
    debouncingDrag() {
      if (this.dragTask) {
        cancelAnimationFrame(this.dragTask);
      }

      this.dragTask = requestAnimationFrame(this.drag);
    },
    dragstart(e) {
      const type = e.target.attributes["component-type"].value;
      this.dragData = type;
    },
    drag() {
      let parentRect = document
        .getElementById("content")
        .getBoundingClientRect();

      let mouseInGrid =
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom;

      if (
        mouseInGrid === true &&
        this.layout.findIndex((item) => item.i === "drop") === -1
      ) {
        this.layout.push({
          x: 0,
          y: this.layout.length,
          w: 1,
          h: 1,
          i: "drop",
          type: this.dragData,
        });
      }

      let index = this.layout.findIndex((item) => item.i === "drop");

      if (index === -1) return;

      const children = this.$refs.gridlayout.$children;
      const lastChild = children[this.layout.length];

      if (lastChild) {
        lastChild.$refs.item.style.display = "none";
      }

      let el = children[index];
      el.dragging = {
        top: mouseXY.y - parentRect.top,
        left: mouseXY.x - parentRect.left,
      };

      let newPos = el.calcXY(
        mouseXY.y - parentRect.top,
        mouseXY.x - parentRect.left
      );

      if (mouseInGrid === true) {
        this.$refs.gridlayout.dragEvent(
          "dragstart",
          "drop",
          newPos.x,
          newPos.y,
          1,
          1
        );

        DragPos.i = String(index);
        DragPos.x = this.layout[index].x;
        DragPos.y = this.layout[index].y;
      } else {
        this.$refs.gridlayout.dragEvent(
          "dragend",
          "drop",
          newPos.x,
          newPos.y,
          1,
          1
        );

        this.layout = this.layout.filter((obj) => obj.i !== "drop");
      }
    },
    dragend() {
      let parentRect = document
        .getElementById("content")
        .getBoundingClientRect();

      let mouseInGrid =
        mouseXY.x > parentRect.left &&
        mouseXY.x < parentRect.right &&
        mouseXY.y > parentRect.top &&
        mouseXY.y < parentRect.bottom;

      if (mouseInGrid === false) return;

      this.$refs.gridlayout.dragEvent(
        "dragend",
        "drop",
        DragPos.x,
        DragPos.y,
        1,
        1
      );

      this.layout = this.layout.filter((obj) => obj.i !== "drop");

      this.layout.push({
        x: DragPos.x,
        y: DragPos.y,
        w: 1,
        h: 1,
        i: DragPos.i,
        type: this.dragData,
      });

      this.dragData = null;

      this.$refs.gridlayout.dragEvent(
        "dragend",
        DragPos.i,
        DragPos.x,
        DragPos.y,
        1,
        1
      );

      const children = this.$refs.gridlayout.$children;
      const lastChild = children[this.layout.length];

      if (lastChild) {
        lastChild.$refs.item.style.display = "block";
      }
    },
  },
};
</script>

<style>
/* .grid .vue-grid-item {
  height: 100% !important;
} */

.grid .vue-grid-item.vue-grid-placeholder {
  background: green;
  /* height: 100% !important; */
  border-radius: 0.5rem;
}

.grid .vue-grid-item:not(.vue-grid-placeholder) {
  /* border: #000 1px solid; */
  min-height: auto !important;
  z-index: 2;
}
</style>

<style scoped>
.view {
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.grid {
  box-shadow: 0 0 1rem 0.3rem rgba(200, 200, 200, 0.8);
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 2rem;
  /* padding: 2rem; */
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
  padding-right: 0.5rem;
}

.components-menu-toggle::after {
  content: "Open";
}

.toggle-ckb {
  display: none;
}

.components-menu-list {
  max-width: 0;
  height: 100vh;
  background-color: #fff;
  box-shadow: -0.5rem 0 0.5rem -0.4rem gray;
  transition: max-width ease-in 0.1s;
  overflow-x: hidden;
}

.toggle-ckb:checked + .components-menu-list {
  max-width: 15rem;
}

.component-row {
  margin: 0.5rem;
  cursor: move;
  position: relative;
}

.component-row > * {
  width: 14rem;
  height: 2.3rem;
}

.component-row > *:not(.mask) {
  z-index: -1;
}

.mask {
  position: absolute;
}
</style>
