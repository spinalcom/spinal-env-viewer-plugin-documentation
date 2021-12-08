import bimObjectService from 'spinal-env-viewer-plugin-bimobjectservice';
import {
  SpinalNode
} from "spinal-env-viewer-graph-service";
import {
  serviceDocumentation
} from "spinal-env-viewer-plugin-documentation-service";
export default {
  getAllLeafDbIds(rootDbid) {
    const tree = this.getInstanceTree();
    const rootId = tree.getRootId();
    let dbidList = [];
    let tmp = [];

    for (let i = 0; i < rootDbid.length; i++) {
      const element = rootDbid[i];
      tmp = this.getLeafDbIds(element)
      dbidList = dbidList.concat(tmp);
      // console.log(tmp);
      // console.log(dbidList);
    }
    return dbidList;
  },

  getInstanceTree() {
    const model = window.spinal.ForgeViewer.viewer.model;
    const tree = model.getData().instanceTree;

    return tree;
  },

  getLeafDbIds(rootId) {
    const tree = this.getInstanceTree();
    const queue = [rootId];
    const dbIds = [];
    let hasChildren;

    while (queue.length) {
      let id = queue.shift();

      hasChildren = false;

      tree.enumNodeChildren(id, childId => {
        hasChildren = true;
        queue.push(childId);
      });

      if (!hasChildren) {
        dbIds.push(id);
      }
    }

    return dbIds;
  },

  getAllCategoryByDbidArray(allChildDbid) {
    let promiseCategory = [];
    let allCategory = [];
    for (let i = 0; i < allChildDbid.length; i++) {
      const element = allChildDbid[i];
      promiseCategory.push(bimObjectService.getBIMObject(
        element).then(node => {
        // console.log(node);
        if (node instanceof SpinalNode)
          return serviceDocumentation.getCategory(
            node)
        return undefined;
      }));
    }
    return Promise.all(promiseCategory).then(res => {
      let check = true;
      const result = res.filter((node) => node !==
        undefined)
      result.forEach(dbid => {
        dbid.forEach(cat => {
          allCategory.forEach(alreadyAdded => {
            if (alreadyAdded.node.info.name.get() === cat.node.info
              .name.get())
              check = false
          })
          if (check)
            allCategory.push(cat);
          check = true;
        });
      })
      return allCategory;
    })
  }
}