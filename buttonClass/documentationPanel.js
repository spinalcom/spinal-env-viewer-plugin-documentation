const {SpinalContextApp} = require ('spinal-env-viewer-context-menu-service');
import {SpinalGraphService} from 'spinal-env-viewer-graph-service';
import {
  serviceDocumentation,
} from 'spinal-env-viewer-plugin-documentation-service';
const {
  spinalPanelManagerService,
} = require ('spinal-env-viewer-panel-manager-service');
const {
  SpinalForgeExtention,
} = require ('spinal-env-viewer-panel-manager-service_spinalforgeextention');
import documentationComponent from '../documentationComponent.vue';
import attributesRightClick from '../view/rightClick/attributesRightClick.vue';
import Vue from 'vue';
import SpinalContext from 'spinal-model-graph/build/Nodes/SpinalContext';
import forgeTree from '../service/forgeTree.js';
export const DocumentationExtension = SpinalForgeExtention.createExtention ({
  name: 'panel-documentation',
  vueMountComponent: Vue.extend (documentationComponent),
  // toolbar is optional

  panel: {
    title: 'Documentation',
    classname: 'spinal-pannel',
    closeBehaviour: 'remove', // if something else panel is deleted
  },
  style: {
    left: '405px',
    height: '50vh',
  },
  onload: () => {},
  onUnLoad: () => {},
});

export const addAutoAttributesRightClick = SpinalForgeExtention.createExtention (
  {
    name: 'attributes-right-click',
    vueMountComponent: Vue.extend (attributesRightClick),
    // toolbar is optional

    panel: {
      title: 'attributes-right-click',
      classname: 'spinal-pannel',
      closeBehaviour: 'remove', // if something else panel is deleted
    },
    style: {
      left: '405px',
      height: '50vh',
    },
    onload: () => {},
    onUnLoad: () => {},
  }
);

export class DocumentationButton extends SpinalContextApp {
  constructor () {
    super ('Documentation', 'Spinal Documentation description', {
      icon: 'folder',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  isShown (option) {
    // to do : put some restriction to see if the selectedNode is a BIMObject or an element of geographiqueContext
    // console.log(option)
    return Promise.resolve (true);
  }

  action (option) {
    // option.paramSent = "hello from DocumentationCircularMenuButton";
    // console.log(option)
    spinalPanelManagerService.openPanel ('panel-documentation', option);
    // console.log("action clicked");
  }
}

export class ExportToDriveButton extends SpinalContextApp {
  constructor () {
    super ('Export File To Drive', 'Spinal Documentation description', {
      icon: 'folder',
      icon_type: 'in',
      backgroundColor: '#356BAB',
      fontColor: '#FFFFFF',
    });
  }

  isShown (option) {
    // to do : put some restriction to see if the selectedNode is a BIMObject or an element of geographiqueContext
    // console.log(option)
    let selectedNode = option.info;
    // let dbid = option.dbid
    // let boolBIMObject = option.exist
    if (option.selectedNode !== undefined) {
      // get real node
      selectedNode = SpinalGraphService.getRealNode (
        option.selectedNode.id.get ()
      );
    }
    if (selectedNode instanceof SpinalContext) return Promise.resolve (true);
    else return Promise.resolve (-1);
    // if (selectedNode.info.type.get() == "geographicContext")
    //   return Promise.resolve(true);
    // else {
    //   return Promise.resolve(-1);
    // }
  }

  action (option) {
    let selectedNode = option.info;
    let dbid = option.dbid;
    let boolBIMObject = option.exist;
    if (option.selectedNode !== undefined) {
      // get real node
      selectedNode = SpinalGraphService.getRealNode (
        option.selectedNode.id.get ()
      );
    }
    let obj = {
      selectedNode,
      dbid,
      boolBIMObject,
    };
    serviceDocumentation.exportToDrive (obj.selectedNode);
    // spinalPanelManagerService.openPanel('panel-notes', obj);
  }
}

export function registerRightClickButton () {
  var checkExist = setInterval (function () {
    // console.log(viewer);
    const viewer = window.spinal.ForgeViewer.viewer;
    if (viewer !== undefined) {
      viewer.registerContextMenuCallback (
        'MyChangingColorMenuItems',
        (menu, status) => {
          // console.log(menu.hasSelected);
          if (status.hasSelected) {
            menu.push ({
              title: 'Add Spinal Attributes',
              target: () => {
                const selSet = viewer.getSelection ();
                // // this.viewer.clearSelection();

                // // const color = new THREE.Vector4(255 / 255, 0, 0, 1);
                // for (let i = 0; i < selSet.length; i++) {
                //   this.viewer.setThemingColor(selSet[i], color);
                // }
                let allChildDbid = forgeTree.getAllLeafDbIds (selSet);
                forgeTree
                  .getAllCategoryByDbidArray (allChildDbid)
                  .then (mycat => {
                    const propsData = {
                      dbid: allChildDbid,
                      category: mycat,
                    };
                    console.log ('open panel add attributes mult');
                    spinalPanelManagerService.openPanel (
                      'attributes-right-click',
                      propsData
                    );
                  });

                // for (let i = 0; i < allChildDbid.length; i++) {
                //   const element = allChildDbid[i];
                //   promiseCategory.push(bimObjectService.getBIMObject(
                //     element).then(node => {
                //     // console.log(node);
                //     if (node instanceof SpinalNode)
                //       return serviceDocumentation.getCategory(
                //         node)
                //     return undefined;
                //   }));
                // }

                // Promise.all(promiseCategory).then(res => {
                //   const result = res.filter((node) => node !==
                //     undefined)
                //   console.log(result);
                //   result.forEach(dbid => {
                //     dbid.forEach(cat => {
                //       allCategory.push(cat);
                //     });
                //   })
                // })

                // Promise.all(promiseCategory).then(el => {
                //   let allCategory = [];
                //   el.forEach(node => {
                //     if (node instanceof SpinalNode) {
                //       serviceDocumentation.getCategory(node)
                //         .then(
                //           (tab) => {
                //             allCategory = allCategory.concat(
                //               tab)
                //           });
                //     }

                //   })
                // })

                // Promise.all(allCategory).then(baka => {
                //   console.log(baka)
                // });
              },
            });
          }
        }
      );
      // console.log("HELLO MENU REGISTERED");
      clearInterval (checkExist);
    }
  }, 100);
}
