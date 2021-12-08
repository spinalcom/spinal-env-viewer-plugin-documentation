const {
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");

import {
  NOTE_TYPE
} from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import {
  utilities
} from "../service/utilities";

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

    return utilities.getIcon(option.selectedNode.get(), option.context.get())
      .then(
        (isColored) => {
          this.buttonCfg["isColored"] = isColored;
          this.buttonCfg.icon = isColored ? "visibility_off" : "visibility";
          return true;
        })
  }

  async action(option) {
    const selected = option.selectedNode.get();
    const context = option.context.get();

    if (this.isColored) {
      this.icon = "visibility";
      this.isColored = false;
      utilities.restoreItem(selected, context);
    } else {
      this.icon = "visibility_off";
      this.isColored = true;
      utilities.colorItem(selected, context);
    }

    window.NOP_VIEWER.impl.invalidate(0, 1, 0);

  }
}

export default ColorMessageParent;