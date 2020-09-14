const {
  SpinalContextApp
} = require('spinal-env-viewer-context-menu-service');
import {
  SpinalGraphService,
  SpinalNode
} from 'spinal-env-viewer-graph-service';

const {
  spinalPanelManagerService,
} = require('spinal-env-viewer-panel-manager-service');

const {
  SpinalForgeExtention,
} = require('spinal-env-viewer-panel-manager-service_spinalforgeextention');

import notesComponent from '../view/notes/components/notesComponent.vue';
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
    width: '400px',
    height: "475px",
    minWidth: '510px'
  },
  onload: () => {},
  onUnLoad: () => {},
});

SpinalForgeExtention.registerExtention(name, noteExtension);

export class NotesButton extends SpinalContextApp {
  constructor() {
    super('Spinal Notes', 'Spinal CDE description', {
      icon: 'insert_comment',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  isShown(option) {
    /*
    if ((option.selectedNode && option.selectedNode.type === 'BIMObject') ||
      option.dbid)
      return Promise.resolve(true);
    // to do : put some restriction to see if the selectedNode is a BIMObject or an element of geographiqueContext
    // console.log(option)
    return Promise.resolve(-1);
    */

    return Promise.resolve(true);

  }


  async action(option) {

    let obj = {
      selectedNode: getSelectedNode(option.selectedNode),
      dbid: option.dbid ? option.dbid : getDbId(option.selectedNode),
      exist: option.exist,
      model: option.model3d
    }

    spinalPanelManagerService.openPanel('panel-notes', obj);

  }

}

const getSelectedNode = (selectedNode) => {
  if (typeof selectedNode === "undefined") return;

  if (selectedNode instanceof SpinalNode)
    return selectedNode;

  return SpinalGraphService.getRealNode(selectedNode.id.get());
}


const getDbId = (selectedNode) => {
  if (selectedNode && selectedNode.info && selectedNode.info.dbid)
    return selectedNode.info.dbid.get();

  else if (selectedNode && selectedNode.dbid) return selectedNode.dbid.get();

}

const createBimObjectNode = () => {

  const viewer = spinal.ForgeViewer.viewer;

  const aggregateSelection = viewer.getAggregateSelection()[0];


  if (aggregateSelection) {
    const dbid = aggregateSelection.selection[0];
    const model = aggregateSelection.model;


    return new Promise((resolve) => {
      viewer.model.getProperties(dbid, async res => {
        const info = await window.spinal.BimObjectService
          .createBIMObject(dbid, res.name, model)

        if (info instanceof SpinalNode) return resolve(info);

        resolve(SpinalGraphService.getRealNode(info.id.get()));
      })

    });
  }
}