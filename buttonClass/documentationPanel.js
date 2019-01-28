const {
  SpinalContextApp,
} = require('spinal-env-viewer-context-menu-service');
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";
import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
const {
  spinalPanelManagerService,
} = require('spinal-env-viewer-panel-manager-service');
const {
  SpinalForgeExtention,
} = require('spinal-env-viewer-panel-manager-service_spinalforgeextention');
import documentationComponent from '../documentationComponent.vue';
import Vue from 'vue';
import SpinalContext from 'spinal-model-graph/build/Nodes/SpinalContext';

export const DocumentationExtension = SpinalForgeExtention.createExtention({
  name: 'panel-documentation',
  vueMountComponent: Vue.extend(documentationComponent),
  // toolbar is optional

  panel: {
    title: 'Documentation',
    classname: 'spinal-pannel',
    closeBehaviour: 'remove', // if something else panel is deleted
  },
  style: {
    left: '405px',
  },
  onload: () => {},
  onUnLoad: () => {},
});


export class DocumentationButton extends SpinalContextApp {
  constructor() {
    super('Documentation', 'Spinal Documentation description', {
      icon: 'folder',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  isShown(option) {
    // to do : put some restriction to see if the selectedNode is a BIMObject or an element of geographiqueContext
    // console.log(option)
    return Promise.resolve(true);
  }

  action(option) {
    // option.paramSent = "hello from DocumentationCircularMenuButton";
    // console.log(option)
    spinalPanelManagerService.openPanel('panel-documentation', option);
    // console.log("action clicked");
  }
}

export class ExportToDriveButton extends SpinalContextApp {
  constructor() {
    super('Export File To Drive', 'Spinal Documentation description', {
      icon: 'folder',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  isShown(option) {
    // to do : put some restriction to see if the selectedNode is a BIMObject or an element of geographiqueContext
    // console.log(option)
    let selectedNode = option.info;
    // let dbid = option.dbid
    // let boolBIMObject = option.exist
    if (option.selectedNode != undefined) {
      // get real node
      selectedNode = SpinalGraphService.getRealNode(
        option.selectedNode.id.get()
      );
    }
    if (selectedNode instanceof SpinalContext)
      return Promise.resolve(true);
    else
      return Promise.resolve(-1);
    // if (selectedNode.info.type.get() == "geographicContext")
    //   return Promise.resolve(true);
    // else {
    //   return Promise.resolve(-1);
    // }
  }

  action(option) {
    let selectedNode = option.info;
    let dbid = option.dbid
    let boolBIMObject = option.exist
    if (option.selectedNode != undefined) {
      // get real node
      selectedNode = SpinalGraphService.getRealNode(
        option.selectedNode.id.get()
      );
    }
    let obj = {
      selectedNode,
      dbid,
      boolBIMObject
    }
    serviceDocumentation.exportToDrive(obj.selectedNode)
    // spinalPanelManagerService.openPanel('panel-notes', obj);
  }
}