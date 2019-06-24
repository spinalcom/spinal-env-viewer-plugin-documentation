const circularMenuHookName = 'circularMenu';
const SideBarHookName = 'GraphManagerSideBar';
const namePanel = 'panel-documentation'
const documentationGroupPanel = 'panel-documentationgroup'
const nameAttributesRightClickPanel = 'attributes-right-click'
const {
  spinalContextMenuService,
} = require('spinal-env-viewer-context-menu-service');
const {
  SpinalForgeExtention,
} = require('spinal-env-viewer-panel-manager-service_spinalforgeextention');

import {
  NotesButton
} from './buttonClass/notesPanel.js'
import {
  DocumentationButton,
  DocumentationExtension,
  ExportToDriveButton,
  addAutoAttributesRightClick,
  registerRightClickButton,
  addAutoUrlRightClick,
  deleteAutoUrlRightClick
} from './buttonClass/documentationPanel.js'
import {
  DocumentationGroupButton
} from "./buttonClass/documentationGroup";
import attributesRightClick from './view/rightClick/attributesRightClick.vue'


// deleteAutoUrlRightClick
//////////////////////////////////////////////////////////////////////////////////////
//                               Documentation
//////////////////////////////////////////////////////////////////////////////////////
SpinalForgeExtention.registerExtention(namePanel, DocumentationExtension);

spinalContextMenuService.registerApp(
  circularMenuHookName,
  new DocumentationButton(),
  [7]
);
spinalContextMenuService.registerApp(
  SideBarHookName,
  new DocumentationButton(), [7]
);
//////////////////////////////////////////////////////////////////////////////////////
//                                Documentation group
//////////////////////////////////////////////////////////////////////////////////////
// SpinalForgeExtention.registerExtention(documentationGroupPanel,
//   DocumentationExtension);

// spinalContextMenuService.registerApp(
//   SideBarHookName,
//   new DocumentationGroupButton(), [7]
// );

//////////////////////////////////////////////////////////////////////////////////////
//                                Notes Button
//////////////////////////////////////////////////////////////////////////////////////
spinalContextMenuService.registerApp(
  circularMenuHookName,
  new NotesButton(), [7]
);
spinalContextMenuService.registerApp(
  SideBarHookName,
  new NotesButton(), [7]
);

//////////////////////////////////////////////////////////////////////////////////////
//                                Export to drive button
//////////////////////////////////////////////////////////////////////////////////////
spinalContextMenuService.registerApp(
  SideBarHookName,
  new ExportToDriveButton(), [7]
);


//////////////////////////////////////////////////////////////////////////////////////
//                                Right click register
//////////////////////////////////////////////////////////////////////////////////////

SpinalForgeExtention.registerExtention("attributes-right-click",
  addAutoAttributesRightClick);
SpinalForgeExtention.registerExtention("url-right-click",
  addAutoUrlRightClick);
SpinalForgeExtention.registerExtention("delete-right-click",
  deleteAutoUrlRightClick);
registerRightClickButton();