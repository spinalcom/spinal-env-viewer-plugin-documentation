import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";

import { NOTE_TYPE } from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import { SIDEBAR_HOOK, registerButtonToHook } from "../buttonHook";

import { noteController } from "../../controllers";

class ColorMessageParent extends SpinalContextApp {
  constructor() {
    super("See message detail", "see Message date", {
      icon: "",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    const type = option.selectedNode.type.get();
    const contextType = option.context.type.get();

    const isNote = type === NOTE_TYPE;

    const isNoteGroupContext = contextType == `${NOTE_TYPE}GroupContext`;

    if (!isNoteGroupContext || isNote) return Promise.resolve(-1);

    return noteController
      .getIcon(option.selectedNode.get(), option.context.get())
      .then((isColored) => {
        this.buttonCfg["isColored"] = isColored;
        this.buttonCfg.icon = isColored ? "visibility_off" : "visibility";
        return true;
      });
  }

  async action(option) {
    const selected = option.selectedNode.get();
    const context = option.context.get();

    if (this.isColored) {
      this.icon = "visibility";
      this.isColored = false;
      noteController.restoreItem(selected, context);
    } else {
      this.icon = "visibility_off";
      this.isColored = true;
      noteController.colorItem(selected, context);
    }

    window.NOP_VIEWER.impl.invalidate(0, 1, 0);
  }
}

const colorMessageParent = new ColorMessageParent();
registerButtonToHook(SIDEBAR_HOOK, colorMessageParent);
export default colorMessageParent;
