<template>
      <b-button variant="primary" style="width: 100%;" @click="click">
        {{ content }}
      </b-button>
</template>

<script>
export default {
  props: ["content"],
  methods: {
    click() {
      console.log("button clicked");
    },
  },
};
</script>
