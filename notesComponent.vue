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
        <ul>
          <message-component v-for="(note,index) in notesDisplayList"
                             :key="index"
                             :date="note.date"
                             :username="note.username"
                             :message="note.message"
                             :type="note.type"
                             :file="note.file"></message-component>
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

          <md-button class="icons md-icon-button md-raised md-primary"
                     @click="addPJ">
            <md-icon>attach_file</md-icon>
          </md-button>

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
  spinalPanelManagerService
} = require("spinal-env-viewer-panel-manager-service");

import { FileExplorer } from "./service/fileSystemExplorer.js";
import { MESSAGE_TYPES } from "spinal-models-documentation";

export default {
  name: "my_compo",
  data() {
    return {
      nodeInfo: undefined,
      messages: {
        messageUser: "",
        pj: []
      },
      // messageUser: "",
      messageUserEdit: "",
      notesDisplayList: [],
      editNodePopup: false,
      selectedNote: undefined,
      scrollToEnd: false,

      noteContextSelected: undefined,
      noteCategorySelected: undefined,
      noteGroupSelected: undefined
    };
  },
  components: {
    "message-component": messageVue,
    "attachment-component": attachmentVue
  },
  methods: {
    async updateNotesList() {
      this.notesDisplayList = [];
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
          element: note.element
        };
        this.notesDisplayList.push(obj);
        i++;
      }
    },

    toDate: function(date) {
      return moment(date).format("MMMM Do YYYY, h:mm:ss a");
    },

    async addFilesNote() {
      if (this.messages.pj.length === 0) return;

      // const option = {
      //   info: this.nodeInfo.selectedNode,
      //   selectedNode: this.nodeInfo.selectedNode.info,
      //   exist: this.nodeInfo.exist
      // };

      const promises = this.messages.pj.map(async file => {
        return {
          file: file,
          directory: await this._getOrCreateFileDirectory(
            this.nodeInfo.selectedNode
          )
        };
      });

      return Promise.all(promises).then(res => {
        return res.map(data => {
          const type = this._getFileType(data.file);

          let files = FileExplorer.addFileUpload(data.directory, [data.file]);
          let file = files.length > 0 ? files[0] : undefined;

          this._sendNote(
            this.nodeInfo.selectedNode,
            data.file.name,
            type,
            file
          );
        });
      });
    },

    async _getOrCreateFileDirectory(node) {
      let directory = await FileExplorer.getDirectory(node);

      if (!directory) {
        directory = await FileExplorer.createDirectory(node);
      }

      return directory;
    },

    _getFileType(file) {
      const imagesExtension = [
        "JPG",
        "PNG",
        "GIF",
        "WEBP",
        "TIFF",
        "PSD",
        "RAW",
        "BMP",
        "HEIF",
        "INDD",
        "JPEG 2000",
        "SVG"
      ];
      const extension = /[^.]+$/.exec(file.name)[0];

      return imagesExtension.indexOf(extension.toUpperCase()) !== -1
        ? MESSAGE_TYPES.image
        : MESSAGE_TYPES.file;
    },

    _sendNote(node, message, type, path) {
      serviceDocumentation
        .addNote(
          node,
          {
            username: window.spinal.spinalSystem.getUser().username,
            userId: FileSystem._user_id
          },
          message,
          type,
          path
        )
        .then(result => {
          serviceDocumentation.linkNoteToGroup(
            this.noteContextSelected.id,
            this.noteGroupSelected.id,
            result.getId().get()
          );
        });
    },

    async addNote() {
      await this.addFilesNote();
      this.messages.pj = [];

      if (this.messages.messageUser.trim().length === 0) return;

      await this._sendNote(
        this.nodeInfo.selectedNode,
        this.messages.messageUser
      );

      // if (this.nodeInfo.exist) {
      /*
      serviceDocumentation
        .addNote(
          this.nodeInfo.selectedNode,
          {
            username: window.spinal.spinalSystem.getUser().username,
            userId: FileSystem._user_id
          },
          this.messages.messageUser
        )
        .then(result => {
          serviceDocumentation.linkNoteToGroup(
            this.noteContextSelected.id,
            this.noteGroupSelected.id,
            result.getId().get()
          );
        });
        */
      // }
      /*
      else {
        // create bim object before add note
        if (this.nodeInfo.dbid !== undefined) {
          serviceDocumentation
            .addNote(
              this.nodeInfo.selectedNode,
              {
                username: window.spinal.spinalSystem.getUser().username,
                userId: FileSystem._user_id
              },
              this.messageUser
            )
            .then(result => {
              serviceDocumentation.linkNoteToGroup(
                this.noteContextSelected.id,
                this.noteGroupSelected.id,
                result.getId().get()
              );
            });

          this.resetBind();
          // }
          // );
        }
      }*/
      this.messages.messageUser = "";
      this.resetBind();
      this.updatedd();
    },

    editNote() {
      // let notes = serviceDocumentation.editNote(selectedNode);
      // console.log(this.selectedNote);
      // console.log(this.messageUserEdit);
      serviceDocumentation.editNote(
        this.selectedNote.element,
        this.messageUserEdit
      );
      this.selectedNote = undefined;
      this.editNodePopup = false;
      this.resetBind();
    },

    deleteNote(noteNode) {
      // console.log(notes);
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
      // console.log("container", container);
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
        }
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
        event => {
          const files = event.target.files;

          let filelist = [];
          for (const file of files) {
            filelist.push(file);
          }

          filelist.push(...this.messages.pj);

          const sizes = filelist.map(el => el.size);

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
      this.messages.pj = this.messages.pj.filter(el => el.name !== file.name);
    }
  },

  async mounted() {
    const contextPromise = serviceDocumentation.createDefaultContext();
    const categoryPromise = serviceDocumentation.createDefaultCategory();
    const groupPromise = serviceDocumentation.createDefaultGroup();

    const data = await Promise.all([
      contextPromise,
      categoryPromise,
      groupPromise
    ]);

    this.noteContextSelected = data[0].info.get();
    this.noteCategorySelected = data[1].info.get();
    this.noteGroupSelected = data[2].info.get();
  }
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
  width: 90%;
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  margin: auto;
}

.notesBox .notesContainer .messages {
  width: 100%;
  height: 85%;
  background: transparent;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 16px;
}

.notesBox .notesContainer .form {
  width: 100%;
  height: 15%;
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
  height: 40px;
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
  height: calc(100% - 40px);
}

.notesBox .notesContainer .form .noteForm .sendBtn {
  flex: 1 1 15%;
  display: flex;
  align-items: flex-end;
}
</style>