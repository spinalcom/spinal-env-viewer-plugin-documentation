<!--
Copyright 2018 SpinalCom - www.spinalcom.com

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
  <md-content class="md-scrollbar notesBox">
    <md-dialog :md-active.sync="editNodePopup">
      <div class="boxTextarea">
        <md-field class="textareaSize">
          <md-textarea v-model="messageUserEdit"></md-textarea>
          <md-button class="md-icon-button sendButtonInTextarea"
                     @click="editNote()">
            <md-icon style="color: white">send</md-icon>
          </md-button>
        </md-field>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="editNodePopup = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
    <md-toolbar class="md-layout md-gutter headerCDE"
                layout-align="center center">
      <div v-if="nodeInfo !== undefined && nodeInfo.selectedNode !== undefined"
           class="centerSelectedNodeName">{{nodeInfo.selectedNode.info.name.get()}}</div>
      <div class="centerSelectedNodeName"
           v-else>BIM Object not created</div>
    </md-toolbar>
    <md-content id="myList"
                class="chat md-scrollbar">
      <div v-for="(note, index) in notesDisplayList"
           :key="index"
           class="myMessage">
        <div>
          <div class="testLine"><span>{{note.date}}</span></div>
          <md-card>
            <md-card-content>
              <div>
                <span style="font-size: 15px; color: #819FF7">{{note.username}}</span>
              </div>
              <div>
                <pre class="preMessage">{{note.message}}</pre>
              </div>
            </md-card-content>
            <md-card-actions v-if="note.username === getUsername()">
              <md-button @click="editNodePopup = true ; selectedNote = note; messageUserEdit = note.message"
                         class="md-icon-button">
                <md-icon>edit</md-icon>
              </md-button>
              <md-button @click="deleteNote(note.selectedNode)"
                         class="md-icon-button">
                <md-icon>delete_forever</md-icon>
              </md-button>
            </md-card-actions>
          </md-card>
        </div>
      </div>

    </md-content>

    <div class="boxTextarea">
      <!-- <md-field class="boxTextarea"> -->
      <!-- <input class="boxTextarea" v-model="messageUser" placeholder="modifiez-moi"> -->
      <div class="textareaSizeLikeBehind">
        <textarea v-model="messageUser"
                  placeholder="ajoutez plusieurs lignes"
                  class="textareaNote"></textarea>
        <!-- <md-textarea style="-webkit-text-fill-color: black; ;width: 100%; min-height: calc(100% - 10px); resize:unset;padding-top: unset; margin-top: 10px; "
                     class="boxTextarea md-scrollbar"
                     v-model="messageUser"></md-textarea> -->
        <md-button class="md-icon-button sendButtonInTextarea"
                   @click="addNote">
          <md-icon style="color:black;">send</md-icon>
        </md-button>
        <!-- </md-field> -->
      </div>
    </div>
  </md-content>
</template>

<script>
  import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service";
  import moment from "moment";

  export default {
  name: "my_compo",
  data() {
    return {
      nodeInfo: undefined,
      messageUser: "",
      messageUserEdit: "",
      notesDisplayList: [],
      editNodePopup: false,
      selectedNote: undefined,
      scrollToEnd: false
    };
  },
  components: {},
  methods: {
    async updateNotesList() {
      this.notesDisplayList = [];
      let notes = await serviceDocumentation.getNotes(
        this.nodeInfo.selectedNode
      );

      let i =0;
      for (let note of notes){

        let obj = {
          id: j,
          username: note.element.username.get(),
          message: note.element.message.get(),
          date: this.toDate(note.element.date.get()),
          selectedNode: note.selectedNode,
          element: note.element
        };
        this.notesDisplayList.push(obj);
        i++;
      }
      for (let j = 0; j < j < notes.length; j++) {

      }

    },
    toDate: function(date) {
      return moment( date ).format( "MMMM Do YYYY, h:mm:ss a" );
      // convert date to 18min ago , 1h ago , ..., not necessery now we pref full date

      // let newDateFormat = moment(date);
      // let newDateFormat2 = moment();
      // newDateFormat2.subtract(1, "days");
      // if (newDateFormat.isBefore(newDateFormat2)) {
      //   return newDateFormat.format("L , LT");
      // } else return newDateFormat.fromNow();
      // "DD MM YY, HH:mm:ss a"
      // return convert.toLocaleDateString("fr-fr", { timeZone: "UTC" });
    },
    addNote() {
      // check if node exist, if node doesn't exist it create it
      // console.log(
      //   this.nodeInfo.selectedNode,
      //   window.spinal.spinalSystem.getUser().username,
      //   this.messageUser
      // );
      if (this.nodeInfo.exist) {

        serviceDocumentation.addNote(
          this.nodeInfo.selectedNode,
          window.spinal.spinalSystem.getUser().username,
          this.messageUser
        );
      } else {
        // create bim object before add note
        if (this.nodeInfo.dbid !== undefined) {

          // window.spinal.ForgeViewer.viewer.model.getProperties(
          //   this.nodeInfo.dbid,
          //   async res => {
          //     this.nodeInfo.selectedNode = await bimObjectService.createBIMObject(
          //       this.nodeInfo.dbid,
          //       res.name
          //     );
          serviceDocumentation.addNote(
            this.nodeInfo.selectedNode,
            window.spinal.spinalSystem.getUser().username,
            this.messageUser
          );
          this.resetBind();
          // }
          // );
        }
      }
      this.messageUser = "";
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
      // console.log(this.nodeInfo);
    },
    removed(option, viewer) {
      console.log("removed option", option);
      console.log("removed viewer", viewer);
    },
    closed(option, viewer) {
      console.log("closed option", option);
      console.log("closed viewer", viewer);
    },
    updatedd() {
      var container = this.$el.querySelector("#myList");
      container.scrollTop = container.scrollHeight;
      // this.onModelChange();
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
    }
  }
};
</script>

<style >
.my-test-panel-container * {
  box-sizing: border-box;
}
.my-test-panel-container-nbr-output {
  text-align: center;
}

.boxTextarea {
  width: 95%;
  margin: auto;
  margin-top: 7px;
  margin-left: 3%;
  border-radius: 10px;
  height: 19%;
  /* background-color: white; */
  resize: unset;
  padding-top: unset;
}
.textareaSize {
  width: 100%;
}
.sendButtonInTextarea {
  position: absolute;
  bottom: 3%;
  right: 7%;
}
.testLine {
  margin-right: 16px;
  margin-left: 16px;
  margin-top: 2px;
  text-align: center;
  border-bottom: 1px solid orange;
}
.preMessage {
  margin: unset;
  overflow-wrap: break-word;
  overflow: "hidden";
  white-space: pre-line;
}

.chat {
  width: 95%;
  height: 70%;
  /* border: solid 1px #eee; */
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  margin: auto;
  margin-top: 9px;
}

.myMessage {
  margin-top: 5px;
}
.textareaNote {
  width: calc(100% - 16px);
  resize: none;
  margin: auto;
  height: 95%;
}
.textareaSizeLikeBehind {
  height: 100%;
}
/* .messages {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
}

.message {
  border-radius: 20px;
  padding: 8px 15px;
  max-width: 90%;
  margin-top: 5px;
  margin-bottom: 5px;
  display: inline-block;
}

.yours {
  margin-left: 5px;
  align-items: flex-start;
}

.yours .message {
  background-color: #eee;
  position: relative;
}

.mine {
  margin-right: 5px;
  align-items: flex-end;
}

.mine .message {
  color: white;
  margin-left: 25%;
  background: linear-gradient(to bottom, #00d0ea 0%, #0085d1 100%);
  background-attachment: fixed;
  position: relative;
}
*/
</style>