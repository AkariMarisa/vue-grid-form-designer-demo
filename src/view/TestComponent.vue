<template>
  <div class="main">
    <!-- <div class="block" draggable="true" @dragstart="dragstart"></div> -->
    <div class="block" draggable="true"></div>
    <div class="block"></div>
    <div class="list">
      <!-- <div
          class="item"
          v-for="n in 10"
          :key="n"
          @dragover="dragover"
          @dragleave.prevent
          @dragenter.prevent
          @drop="drop"
        > -->
      <div class="item" v-for="n in 10" :key="n">
        <div class="content">{{ n }}</div>
        <transition>
          <div class="placeholder"></div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    dragStart() {
      console.log("dragstart");
    },
    dragEnd() {
      console.log("dragend");
    },
  },
};
</script>
<style scoped>
.block {
  margin: 1px;
  padding: 1px;
  border: 1px solid black;
  width: 64px;
  height: 64px;
  background-color: pink;
}

.main {
  width: 1024px;
  margin: 20px auto;
  border: 1px solid #ee8544;
  min-height: 300px;
}

.list {
  border: 1px solid #aaffdd;
  height: 100%;
}

.item {
  padding: 5px;
}

.item > * {
  /* pointer-events: none; */
}

.item > .content {
  border: 1px solid #ff6699;
}

.item > .placeholder {
  width: 100%;
  height: 0;
  background-color: pink;
  opacity: 0.9;
  transition: height 0.075s ease-in;
}
</style>
