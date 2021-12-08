import { SpinalContextApp } from "spinal-env-viewer-context-menu-service";
import { spinalPanelManagerService } from "spinal-env-viewer-panel-manager-service";

import {
  CIRCULAR_MENU_HOOK,
  SIDEBAR_HOOK,
  registerButtonToHook,
} from "../buttonHook";

class DocumentationButton extends SpinalContextApp {
  constructor() {
    super("Documentation", "Spinal Documentation description", {
      icon: "folder",
      icon_type: "in",
      backgroundColor: "#356BAB",
      fontColor: "#FFFFFF",
    });
  }

  isShown(option) {
    //   if (option.selectedNode) {
    //     const type = option.selectedNode.type.get();
    //     if (type === "SpinalService" || type === "SpinalContext" || type ===
    //       "dashboardContext" ||
    //       type === "BimFile" ||
    //       type === "scene")
    //       return (Promise.resolve(-1))
    //   }
    return Promise.resolve(true);
  }

  action(option) {
    spinalPanelManagerService.openPanel("panel-documentation", option);
  }
}

const documentationButton = new DocumentationButton();
registerButtonToHook([CIRCULAR_MENU_HOOK, SIDEBAR_HOOK], documentationButton);
export default documentationButton;
