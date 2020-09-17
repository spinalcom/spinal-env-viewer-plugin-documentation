<!--
Copyright 2020 SpinalCom - www.spinalcom.com

This file is part of SpinalCore.

Please read all of the following terms and conditions
of the Free Software license Agreement ("Agreement")
carefully.

This Agreement is a legally binding contract between
the Licensee (as defined below) and SpinalCom that
sets forth the terms and conditions that govern your
use of the Program. By installing and/or using the
Program, you agree to abide by all the terms and
conditions stated or referenced herein.

If you do not agree to abide by these terms and
conditions, do not demonstrate your acceptance and do
not install or use the Program.
You should have received a copy of the license along
with this file. If not, see
<http://resources.spinalcom.com/licenses.pdf>.
-->


<template>
  <div class="notesBox">
    <md-toolbar class="mdToolbar md-dense"
                md-elevation="0">

      <!-- <div class="md-toolbar-section-start titleDiv">
        <div v-if="nodeInfo && nodeInfo.selectedNode">
          {{nodeInfo.selectedNode.info.name.get()}}
        </div>

        <div v-else>BIM Object not created</div>
      </div> -->

      <div class="md-toolbar-section-start breadCrumb">
        <div
             v-if="noteContextSelected && noteCategorySelected && noteGroupSelected">
          <div>
            <span
                  class="md-primary md-caption">{{noteContextSelected.name}}</span>
            <span class="md-primary md-caption">/</span>
            <span
                  class="md-primary md-caption">{{noteCategorySelected.name}}</span>
            <span class="md-primary md-caption">/</span>
            <span
                  class="md-primary md-caption">{{noteGroupSelected.name}}</span>
          </div>
        </div>
      </div>

      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button md-primary"
                   @click="OpenLinkDialog">
          <md-icon>settings_applications</md-icon>
        </md-button>
      </div>

    </md-toolbar>

    <div class="notesContainer">
      <md-content id="myList"
                  class="messages md-scrollbar">
        <ul class="div_messages">
          <message-component v-for="(note,index) in notesDisplayList"
                             :key="index"
                             :date="note.date"
                             :username="note.username"
                             :message="note.message"
                             :type="note.type"
                             :file="note.file"
                             :viewPoint="note.viewPoint"></message-component>
        </ul>

      </md-content>

      <div class="form">
        <form @submit.prevent="addNote"
              class="noteForm">

          <!-- <md-button class="md-icon-button md-raised md-primary">
            <md-icon>menu</md-icon>
          </md-button> -->

          <!-- <div class="icons">
            <md-icon @click="addPJ">description</md-icon>
          </div> -->

          <div class="icons">
            <md-button class="icons md-icon-button md-raised md-primary"
                       @click="addPJ"
                       :title="'Add Attachment'">
              <md-icon>attach_file</md-icon>
            </md-button>

            <md-button class="icons md-icon-button md-raised md-primary"
                       @click="TakeScreenShot"
                       :title="'Take a screenshot'">
              <md-icon>add_a_photo</md-icon>
            </md-button>

            <md-button class="icons md-icon-button md-raised md-primary"
                       @click="saveViewPoint"
                       :title="'save point of view'">
              <md-icon>near_me</md-icon>
            </md-button>
          </div>

          <div class="messageForm">
            <md-content class="pjDiv md-scrollbar"
                        v-if="messages.pj.length > 0">

              <attachment-component v-for="(file,index) in messages.pj"
                                    :key="index"
                                    :file="file"
                                    @remove="removePJ">{{file.name}}
              </attachment-component>
            </md-content>
            <md-field class="myField">
              <label>Message</label>
              <md-input v-model="messages.messageUser"></md-input>
            </md-field>
          </div>

          <div class="sendBtn">
            <md-button type="submit"
                       class="md-dense md-raised md-primary">
              Send
              <md-icon>send</md-icon>
            </md-button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
import { NOTE_TYPE } from "spinal-env-viewer-plugin-documentation-service/dist/Models/constants";

import moment from "moment";
import messageVue from "./message.vue";
import attachmentVue from "./attachment.vue";

const {
  spinalPanelManagerService,
} = require("spinal-env-viewer-panel-manager-service");

import { FileExplorer } from "../../../service/fileSystemExplorer.js";
import { MESSAGE_TYPES } from "spinal-models-documentation";
import {
  SpinalNode,
  SpinalGraphService,
} from "spinal-env-viewer-graph-service";

export default {
  name: "my_compo",
  data() {
    this.viewPoints = new Map();

    return {
      userConnected: {
        username: window.spinal.spinalSystem.getUser().username,
        userId: FileSystem._user_id,
      },
      nodeInfo: undefined,
      messages: {
        messageUser: "",
        pj: [],
      },
      // messageUser: "",
      messageUserEdit: "",
      notesDisplayList: [],
      editNodePopup: false,
      selectedNote: undefined,
      scrollToEnd: false,

      noteContextSelected: undefined,
      noteCategorySelected: undefined,
      noteGroupSelected: undefined,
    };
  },
  components: {
    "message-component": messageVue,
    "attachment-component": attachmentVue,
  },
  methods: {
    async updateNotesList() {
      this.notesDisplayList = [];

      if (this.nodeInfo.selectedNode) {
        let notes = await serviceDocumentation.getNotes(
          this.nodeInfo.selectedNode
        );

        let i = 0;
        for (let note of notes) {
          let obj = {
            id: i,
            username: note.element.username.get(),
            message: note.element.message.get(),
            date: this.toDate(note.element.date.get()),
            type: note.element.type ? note.element.type.get() : undefined,
            file: note.element.file,
            selectedNode: note.selectedNode,
            element: note.element,
            viewPoint: note.element.viewPoint,
          };
          this.notesDisplayList.push(obj);
          i++;
        }
      }
    },

    toDate: function (date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },

    async addFilesNote() {
      if (this.messages.pj.length === 0) return;

      await serviceDocumentation.addFileAsNote(
        this.nodeInfo.selectedNode,
        this.messages.pj,
        this.userConnected,
        this.noteContextSelected.id,
        this.noteGroupSelected.id
      );

      // const promises = this.messages.pj.map(async (file) => {
      //   return {
      //     file: file,
      //     directory: await this._getOrCreateFileDirectory(
      //       this.nodeInfo.selectedNode
      //     ),
      //   };
      // });

      // return Promise.all(promises).then((res) => {
      //   return res.map((data) => {
      //     const type = this._getFileType(data.file);

      //     let files = FileExplorer.addFileUpload(data.directory, [data.file]);
      //     let file = files.length > 0 ? files[0] : undefined;

      //     this._sendNote(
      //       this.nodeInfo.selectedNode,
      //       data.file.name,
      //       type,
      //       file
      //     );
      //   });
      // });
    },

    _sendNote(node, message, type, path) {
      return serviceDocumentation.addNote(
        node,
        this.userConnected,
        message,
        type,
        path,
        this.noteContextSelected.id,
        this.noteGroupSelected.id
      );
    },

    async addNote() {
      if (typeof this.nodeInfo.selectedNode === "undefined") {
        this.nodeInfo.selectedNode = await this._createBimObjectNode(
          this.nodeInfo.model,
          this.nodeInfo.dbid
        );

        this.updatedd();
      }

      await this.addFilesNote();
      this.messages.pj = [];

      if (this.messages.messageUser.trim().length === 0) return;

      await this._sendNote(
        this.nodeInfo.selectedNode,
        this.messages.messageUser
      );
      this.messages.messageUser = "";
      this.resetBind();
      this.updatedd();
    },

    editNote() {
      serviceDocumentation.editNote(
        this.selectedNote.element,
        this.messageUserEdit
      );
      this.selectedNote = undefined;
      this.editNodePopup = false;
      this.resetBind();
    },

    deleteNote(noteNode) {
      serviceDocumentation.removeNode(noteNode);
    },

    getUsername() {
      return window.spinal.spinalSystem.getUser().username;
    },

    opened(option) {
      this.nodeInfo = option;
      this.resetBind();
      this.updatedd();
    },

    removed(option, viewer) {},

    closed(option, viewer) {},

    updatedd() {
      var container = document.querySelector("#myList");
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 300);
    },

    resetBind() {
      if (this.nodeInfo !== undefined) {
        if (this.nodeInfo.selectedNode !== undefined) {
          if (this.myBind !== undefined) {
            this.nodeInfo.selectedNode.unbind(this.myBind);
            this.myBind = undefined;
          }
          if (this.myBind === undefined) {
            this.myBind = this.nodeInfo.selectedNode.bind(
              this.updateNotesList.bind(this)
            );
          }
        }
      }
    },

    OpenLinkDialog() {
      spinalPanelManagerService.openPanel("linkToGroupDialog", {
        type: NOTE_TYPE,
        itemSelected: [],
        callback: (context, category, group) => {
          this.noteContextSelected = context;
          this.noteCategorySelected = category;
          this.noteGroupSelected = group;
        },
      });
    },

    addPJ() {
      const maxSize = 25000000;
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;

      input.click();

      input.addEventListener(
        "change",
        (event) => {
          const files = event.target.files;

          let filelist = [];
          for (const file of files) {
            filelist.push(file);
          }

          filelist.push(...this.messages.pj);

          const sizes = filelist.map((el) => el.size);

          const filesSize = sizes.reduce((a, b) => a + b);

          if (filesSize > maxSize) {
            alert(
              "The selected file(s) is too large. The maximum size must not exceed 25 MB"
            );
            return;
          }

          this.messages.pj = filelist;
        },
        false
      );
    },

    removePJ(file) {
      this.messages.pj = this.messages.pj.filter((el) => el.name !== file.name);
    },

    async TakeScreenShot() {
      const file = await this.getScreenShotFile();
      this.messages.pj.push(file);
    },

    getScreenShotFile() {
      return new Promise(async (resolve, reject) => {
        window.spinal.ForgeViewer.viewer.getScreenShot(0, 0, async (url) => {
          let blob = await fetch(url).then((r) => r.blob());
          const name = this.nodeInfo.selectedNote
            ? this.nodeInfo.selectedNote.getName().get()
            : await this.getObjectName(this.nodeInfo.model, this.nodeInfo.dbid);

          let file = this.blobToFile(
            blob,
            `screenshot of ${name} from ${moment().format("L")}.png`
          );

          resolve(file);
        });
      });
    },

    getObjectName(model, dbid) {
      if (model && dbid) {
        return new Promise((resolve) => {
          model.getProperties(dbid, async (res) => {
            console.log(res.name);
            resolve(res.name);
          });
        });
      }
      return "";
    },

    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date();
      theBlob.name = fileName;
      return theBlob;
    },

    _createBimObjectNode(model, dbid) {
      if (model && dbid) {
        return new Promise((resolve) => {
          model.getProperties(dbid, async (res) => {
            const info = await window.spinal.BimObjectService.createBIMObject(
              dbid,
              res.name,
              model
            );
            if (info instanceof SpinalNode) return resolve(info);

            resolve(SpinalGraphService.getRealNode(info.id.get()));
          });
        });
      }
    },

    async saveViewPoint() {
      const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };

      const viewer = window.spinal.ForgeViewer.viewer;

      const filter = {
        guid: true,
        seedURN: true,
        overrides: true,
        objectSet: false,
        viewport: true,
        renderOptions: true,
      };
      const file = await this.getScreenShotFile();
      const viewerState = viewer.getState(filter);
      const objectState = {
        isolated: viewer
          .getAggregateIsolation()
          .map((el) => ({ modelId: el.model.id, ids: el.ids })),

        selected: viewer
          .getAggregateSelection()
          .map((el) => ({ modelId: el.model.id, selection: el.selection })),
      };

      file.viewState = JSON.stringify(viewerState, getCircularReplacer());
      file.objectState = JSON.stringify(objectState, getCircularReplacer());

      this.messages.pj.push(file);
    },
  },

  async mounted() {
    const context = await serviceDocumentation.createDefaultContext();
    const category = await serviceDocumentation.createDefaultCategory();
    const group = await serviceDocumentation.createDefaultGroup();

    this.noteContextSelected = context.info.get();
    this.noteCategorySelected = category.info.get();
    this.noteGroupSelected = group.info.get();
  },
};
</script>

<style scoped>
.notesBox {
  width: 100%;
  height: calc(100% - 15px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.notesBox .mdToolbar {
  padding: 0px !important;
}

.notesBox .mdToolbar .breadCrumb {
  display: flex;
}

.notesBox .notesContainer {
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  margin: auto;
}

.notesBox .notesContainer .messages {
  width: 100%;
  height: 80%;
  background: transparent;
  overflow: hidden;
  overflow-y: auto;
  padding: 0;
}

.div_messages {
  width: 90%;
  height: 100%;
  margin: auto;
}

.notesBox .notesContainer .form {
  width: 100%;
  height: 20%;
}

.notesBox .notesContainer .form .noteForm {
  width: 100%;
  height: 100%;
  display: flex;
}

.notesBox .notesContainer .form .noteForm .icons {
  flex: 0 0 25px;
  display: flex;
  align-items: flex-end;
  align-self: flex-end;
  border-radius: 20%;
}

.notesBox .notesContainer .form .noteForm .messageForm {
  flex: 1 1 calc(85% - 25px);
  display: flex;
  flex-direction: column;
}

.notesBox .notesContainer .form .noteForm .messageForm .pjDiv {
  height: 50px;
  background: transparent;
  overflow: auto;
}

.notesBox .notesContainer .form .noteForm .messageForm .pjDiv p {
  margin: 0px;
}

.notesBox .notesContainer .form .noteForm .messageForm .myField {
  flex: 1 1 auto;
  margin: 0px !important;
  min-height: unset !important;
  height: calc(100% - 50px);
}

.notesBox .notesContainer .form .noteForm .sendBtn {
  flex: 1 1 15%;
  display: flex;
  align-items: flex-end;
}
</style>