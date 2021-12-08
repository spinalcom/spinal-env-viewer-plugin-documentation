const { SpinalContextApp } = require("spinal-env-viewer-context-menu-service");

import {
  NOTE_TYPE,
  NOTE_RELATION,
} from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import { noteController } from "../../../controllers";

class FindMessageParent extends SpinalContextApp {
  constructor() {
    super("Find Message Parent", "Find message Parent", {
      icon: "find_in_page",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    const contextType = option.context.type.get();
    const type = option.selectedNode.type.get();

    return contextType === `${NOTE_TYPE}GroupContext`
      ? Promise.resolve(true)
      : Promise.resolve(-1);
  }

  async action(option) {
    const nodeId = option.selectedNode.id.get();
    const contextId = option.context.id.get();

    const parents = await noteController.getNoteParentsBim(nodeId, contextId);

    if (!parents || (parents && parents.length === 0)) {
      window.alert("No parent on bimMaquette");
      return;
    }

    parents.forEach((el) => {
      el.model.selector.setSelection(el.ids, el.model, "selectOnly");
    });
  }
}

export default FindMessageParent;
