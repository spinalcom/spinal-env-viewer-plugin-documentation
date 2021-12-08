import { spinalContextMenuService } from "spinal-env-viewer-context-menu-service";

export const HEADBAR_HOOK = "";
export const SIDEBAR_HOOK = "GraphManagerSideBar";
export const CIRCULAR_MENU_HOOK = "circularMenu";

export function registerButtonToHook(hookNames, btnClassInstance) {
  if (!Array.isArray(hookNames)) hookNames = [hookNames];

  for (const hookName of hookNames) {
    spinalContextMenuService.registerApp(hookName, btnClassInstance, [7]);
  }
}
