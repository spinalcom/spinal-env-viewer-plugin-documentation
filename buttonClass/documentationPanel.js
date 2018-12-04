const {
  SpinalContextApp,
} = require('spinal-env-viewer-context-menu-service');

const {
  spinalPanelManagerService,
} = require('spinal-env-viewer-panel-manager-service');
const {
  SpinalForgeExtention,
} = require('spinal-env-viewer-panel-manager-service_spinalforgeextention');
import documentationComponent from '../documentationComponent.vue';
import Vue from 'vue';

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
    console.log(option)
    return Promise.resolve(true);
  }

  action(option) {
    // option.paramSent = "hello from DocumentationCircularMenuButton";
    spinalPanelManagerService.openPanel('panel-documentation', option);
    // console.log("action clicked");
  }
}