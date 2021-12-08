import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import { NOTE_TYPE } from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import { SIDEBAR_HOOK, registerButtonToHook } from "../buttonHook";

class MessageDetail extends SpinalContextApp {
  constructor() {
    super("See message detail", "see Message date", {
      icon: "announcement",
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

    return isNote || isNoteGroupContext
      ? Promise.resolve(true)
      : Promise.resolve(-1);
  }

  async action(option) {
    const nodeId = option.selectedNode.id.get();
    const contextId = option.context.id.get();

    spinalPanelManagerService.openPanel("messageDetailDialog", {
      nodeId: nodeId,
      contextId: contextId,
    });
  }
}

const messageDetail = new MessageDetail();
registerButtonToHook(SIDEBAR_HOOK, messageDetail);
export default messageDetail;
