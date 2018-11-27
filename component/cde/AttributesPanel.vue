<template>
  <md-content class="md-scrollbar attributesBox">
    hello world
  </md-content>
</template>


<script>
export default {
  name: 'linkPanel',
  data() {
    return {};
  },
  components: {},
  props: ['selectedNode', 'dbid'],
  methods: {},
  mounted() {},
};
</script>

<style>
.attributesBox {
  background: transparent !important;
   box-sizing: border-box;
    height: calc(100% - 50px);
}
</style>