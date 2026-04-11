<template>
  <NotificationBar />
  <div v-for="project in projects" :key="project.id" class="d-flex flex-row">
    <ProjectListItem
      :project="project"
      @delete-project="deleteProject"
      @open-project="openProject"
    />
  </div>
</template>
<script>
// Components
import ProjectListItem from "./ProjectListItem.vue";
import NotificationBar from "@/components/GenericComponents/NotificationBar.vue";

import { useNotificationStore } from "@/store/notification.js";

// store
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

// ApiService
import apiService from "@/services/apiService";

export default {
  components: {
    ProjectListItem,
    NotificationBar,
  },
  data() {
    return {
      projects: null,
    };
  },
  mounted() {
    apiService.Project.getAll().then((res) => {
      this.projects = res;
    });
  },

  methods: {
    ...mapActions(useAppStore, ["loadStylejson", "loadProject"]),
    ...mapActions(useNotificationStore, ["showNotification"]),
    openProject: function (data) {
      this.loadStylejson(data.stylejson);
      this.loadProject(data.project);

      this.$router.push({ name: "editor" });
    },
    deleteProject(project) {
      apiService.Project.delete(project.id).then((res) => {
        this.showNotification("Project deleted successfully", "success");
        this.projects = this.projects.filter((x) => x.id !== project.id);
      });
    },
  },
};
</script>
<style></style>
