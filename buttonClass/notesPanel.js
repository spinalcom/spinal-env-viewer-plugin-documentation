const {
  SpinalContextApp,
} = require('spinal-env-viewer-context-menu-service');

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
  },
  onload: () => {},
  onUnLoad: () => {},
});

SpinalForgeExtention.registerExtention(name, noteExtension);

export class NotesButton extends SpinalContextApp {
  constructor() {
    super('Spinal CDE', 'Spinal CDE description', {
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
    spinalPanelManagerService.openPanel('panel-notes', option);
    // console.log("action clicked");
  }
}