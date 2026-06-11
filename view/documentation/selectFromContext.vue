<template>
    <div>
        <v-treeview :items="filesTree" activatable dark transition :open.sync="open" :load-children="getChildren"
            color="primary" :active.sync="active" @update:active="selectStartFile">
            <template v-slot:prepend="{ item, open }">
                <v-icon> {{ getIcon(item, open) }} </v-icon>
            </template>
        </v-treeview>
    </div>
</template>

<script>
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { TO_FILE_RELATION, TO_FOLDER_RELATION } from 'spinal-env-viewer-plugin-documentation-service';

const DOCUMENTARY_CONTEXT_TYPE = "DocumentaryContext";

export default {
    name: "selectFromContext",
    data() {
        return {
            filesTree: [],
            selectedFiles: [],
            open: [],
            active: []

        };
    },

    methods: {
        async getFilesFromContext() {
            this.filesTree = await this.getFilesContexts();
            console.log("this.filesTree", this.filesTree);
        },

        async selectFile(file) {
            this.selectedFiles.push(file);
            this.$emit("selected", this.selectedFiles);
        },

        getFilesContexts() {
            const contexts = SpinalGraphService.getContextWithType(DOCUMENTARY_CONTEXT_TYPE);
            return contexts.map(context => ({ ...context.info.get(), children: [] }));
        },

        getChildren(item) {
            const relations = [TO_FILE_RELATION, TO_FOLDER_RELATION];

            return SpinalGraphService.getChildren(item.id, relations).then(children => {
                console.log("children", children);
                const formattedChildren = children.map(child => ({ ...child.get(), children: [] }));
                item.children = formattedChildren;
                return formattedChildren;
            });
        },

        getIcon(item, isOpen) {
            const itemExtension = item.name?.split('.').pop().toLowerCase() || '';
            const iconMap = {
                html: 'html',
                js: 'javascript',
                pdf: 'picture_as_pdf',
                png: 'image',
                jpg: 'image',
                jpeg: 'image',
            }

            const iconFound = iconMap[itemExtension];
            if (iconFound) return iconFound;

            if (item.type == "SpinalDirectory" || item.type == DOCUMENTARY_CONTEXT_TYPE) {
                if (isOpen) return "folder_open";

                return "folder";
            }
            return 'insert_drive_file';
        },

        selectStartFile(actives) {
            console.log("actives", actives);
            // const activeId = actives[0];
            this.startFileSelected = actives.map(id => SpinalGraphService.getRealNode(id));
            this.$emit("selected", this.startFileSelected);
        },


    },

    mounted() {
        this.getFilesFromContext();
    }
}
</script>

<style scoped></style>