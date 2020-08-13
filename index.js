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


import FindMessageParentBtn from "./buttonClass/findMessageParent.js"

import MessageDetail from "./buttonClass/messageDetail.js";

import ColorMessageParent from "./buttonClass/seeMessage.js";

import {
  NotesButton
} from './buttonClass/notesPanel.js'

import messageDialog from "./view/notes/dialogs/registerDialogs.js";


import {
  DocumentationButton,
  DocumentationExtension,
  ExportToDriveButton,
  addAutoAttributesRightClick,
  registerRightClickButton,
  addAutoUrlRightClick,
  deleteAutoUrlRightClick
} from './buttonClass/documentationPanel.js'
// import {
//   DocumentationGroupButton
// } from "./buttonClass/documentationGroup";
import attributesRightClick from './view/rightClick/attributesRightClick.vue'
import {
  SpinalMountExtention
} from "spinal-env-viewer-panel-manager-service";


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

spinalContextMenuService.registerApp(
  SideBarHookName,
  new FindMessageParentBtn(), [7]
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
//                                Notes
//////////////////////////////////////////////////////////////////////////////////////
spinalContextMenuService.registerApp(
  circularMenuHookName,
  new NotesButton(), [7]
);

spinalContextMenuService.registerApp(
  SideBarHookName,
  new NotesButton(), [7]
);

spinalContextMenuService.registerApp(
  SideBarHookName,
  new MessageDetail(), [7]
);

spinalContextMenuService.registerApp(SideBarHookName, new ColorMessageParent(),
  [7]);

SpinalMountExtention.mount(messageDialog);

//////////////////////////////////////////////////////////////////////////////////////
//                                Export to drive button
//////////////////////////////////////////////////////////////////////////////////////
// spinalContextMenuService.registerApp(
//   SideBarHookName,
//   new ExportToDriveButton(), [7]
// );


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