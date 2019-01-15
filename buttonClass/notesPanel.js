const {
  SpinalContextApp,
} = require('spinal-env-viewer-context-menu-service');
import {
  SpinalGraphService
} from "spinal-env-viewer-graph-service";

const {
  spinalPanelManagerService,
} = require('spinal-env-viewer-panel-manager-service');
const {
  SpinalForgeExtention,
} = require('spinal-env-viewer-panel-manager-service_spinalforgeextention');
import notesComponent from '../notesComponent.vue';
import Vue from 'vue';

const noteExtension = SpinalForgeExtention.createExtention({
  name: 'panel-notes',
  vueMountComponent: Vue.extend(notesComponent),
  // toolbar is optional

  panel: {
    title: 'Notes',
    classname: 'spinal-pannel',
    closeBehaviour: 'remove', // if something else panel is deleted
  },
  style: {
    left: '405px',
    width: '400px'
  },
  onload: () => {},
  onUnLoad: () => {},
});

SpinalForgeExtention.registerExtention(name, noteExtension);

export class NotesButton extends SpinalContextApp {
  constructor() {
    super('Spinal Notes', 'Spinal CDE description', {
      icon: 'border_color',
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
    // option.paramSent = "hello from NoteCircularMenu";
    // console.log(option)
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

    spinalPanelManagerService.openPanel('panel-notes', obj);
    // console.log("action clicked");
  }
}