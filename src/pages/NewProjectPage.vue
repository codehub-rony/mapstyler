<template>
  <NotificationBar />
  <v-form ref="projectform">
    <v-container>
      <v-row class="justify-center">
        <v-col cols="4">
          <h2>Create a new project</h2>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="4">
          <InputTextField
            v-model="projectName"
            :validationRules="['not_empty']"
            ref="projectname"
            ><template #label>Project name</template></InputTextField
          >
          <InputTextField v-model="description"
            ><template #label>Description</template></InputTextField
          >
        </v-col>
      </v-row>
      <v-row class="justify-center"
        ><v-col cols="4">
          <div class="d-flex justify-end">
            <DefaultButton @click="saveProject" :loading="loading"
              ><template #label>create</template></DefaultButton
            >
          </div></v-col
        ></v-row
      >
    </v-container>
  </v-form>
</template>
<script>
import DefaultButton from "@/components/DefaultButton.vue";
import InputTextField from "@/components/GenericComponents/InputTextField.vue";
import NotificationBar from "@/components/GenericComponents/NotificationBar.vue";

// ApiService
import apiService from "@/services/apiService";

// ProjectService
import { createEmptyProject } from "@/services/ProjectFactory";

// store
import { useNotificationStore } from "@/store/notification.js";
import { useAppStore } from "@/store/app.js";
import { mapActions } from "pinia";

export default {
  components: {
    DefaultButton,
    InputTextField,
    NotificationBar,
  },
  data() {
    return {
      projectName: null,
      description: null,
      loading: false,
    };
  },
  methods: {
    ...mapActions(useAppStore, ["setProject"]),
    ...mapActions(useNotificationStore, ["showNotification"]),

    async saveProject() {
      const { valid } = await this.$refs.projectform.validate();
      if (valid) {
        this.loading = true;
        apiService.Project.create({
          name: this.projectName,
          description: this.description,
        })
          .then((res) => {
            const project = createEmptyProject(
              res.id,
              res.name,
              res.description,
            );
            this.setProject(project);

            this.projectName = this.description = null;
            this.$router.push("/editor");
          })
          .catch((err) => {
            this.showNotification("Failed to create a project", "error");
            this.loading = false;
          });
      }
    },
  },
};
</script>
<style></style>
