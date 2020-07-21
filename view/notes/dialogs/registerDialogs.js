import vue from "vue";
import messageDialog from "./messageDetailDialog.vue";

export default {
  name: "messageDetailDialog",
  vueMountComponent: vue.extend(messageDialog),
  parentContainer: document.body
}