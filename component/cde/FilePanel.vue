<template>
  <md-content class="md-scrollbar filesBox">
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
.filesBox {
  background: transparent !important;
   box-sizing: border-box;
    height: calc(100% - 50px);
}
</style>