const circularMenuHookName = 'circularMenu';
const SideBarHookName = 'GraphManagerSideBar';
const namePanel = 'panel-documentation'
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
  DocumentationExtension
} from './buttonClass/documentationPanel.js'



SpinalForgeExtention.registerExtention(namePanel, DocumentationExtension);


spinalContextMenuService.registerApp(
  circularMenuHookName,
  new DocumentationButton()
);
spinalContextMenuService.registerApp(
  SideBarHookName,
  new DocumentationButton()
);

spinalContextMenuService.registerApp(
  circularMenuHookName,
  new NotesButton()
);
spinalContextMenuService.registerApp(
  SideBarHookName,
  new NotesButton()
);