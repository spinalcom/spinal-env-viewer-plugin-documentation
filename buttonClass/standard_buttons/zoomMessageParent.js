const {
  SpinalContextApp
} = require("spinal-env-viewer-context-menu-service");

import {
  NOTE_TYPE,
  NOTE_RELATION,
} from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import {
  utilities
} from "../../service/utilities";


class FindMessageParent extends SpinalContextApp {
  constructor() {
    super("Zoom", "Find message Parent", {
      icon: "zoom_in",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    const contextType = option.context.type.get();
    const type = option.selectedNode.type.get();

    console.log(contextType, type)

    return contextType === `${NOTE_TYPE}GroupContext` ? Promise.resolve(
        true) :
      Promise.resolve(-1);
  }

  async action(option) {
    const nodeId = option.selectedNode.id.get();
    const contextId = option.context.id.get();

    const parents = await utilities.getNoteParentsBim(nodeId, contextId);

    if (!parents || (parents && parents.length === 0)) {
      window.alert("No parent on bimMaquette");
      return;
    }

    const dbIds = parents.map(el => el.ids)

    window.spinal.ForgeViewer.viewer.fitToView(dbIds.flat());
  }
}

export default FindMessageParent;