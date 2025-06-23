<template>
  <v-app-bar flat elevation="1">
    <div class="d-flex flex-row align-center">
      <v-img
        :src="logo"
        width="40px"
        class="pa-2 ml-2 app-bar-logo"
        @click="refresh"
      />
      <div class="toolbar-title">MapStyler</div>

      <div v-if="isAuthenticated()" class="ml-4 d-flex flex-row">
        <v-btn
          color="black"
          size="small"
          class="mt-1"
          @click="$router.push({ name: 'projects' })"
          :variant="$route.name === 'projects' ? 'text' : 'plain'"
          >projects</v-btn
        >
        <v-btn
          color="black"
          background
          size="small"
          class="mt-1"
          @click="$router.push({ name: 'editor' })"
          :variant="$route.name === 'editor' ? 'text' : 'plain'"
          >editor</v-btn
        >
      </div>
    </div>

    <v-spacer></v-spacer>
    <template v-slot:append>
      <v-btn
        v-if="!isAuthenticated()"
        icon="mdi-github"
        href="https://github.com/codehub-rony/map-styler"
        target="_blank"
      ></v-btn>
      <v-btn
        color="black"
        size="small"
        href="https://www.oneprojectatatime.nl/tag/mapstyler/"
        target="_blank"
        variant="text"
        rel="noopener"
        class="mr-2 mt-1"
        rounded="0"
        v-if="!isAuthenticated()"
        >blog</v-btn
      >
      <!-- <v-btn
        color="#FFDD00"
        size="small"
        variant="flat"
        href="https://www.buymeacoffee.com/RonyNedkov"
        target="_blank"
        class="mr-4"
        ><span> &#9749; </span>Buy me a coffee</v-btn
      > -->
      <v-btn
        v-if="!isAuthenticated()"
        variant="text"
        rounded="0"
        color="black"
        class="mr-4 mt-1"
        size="small"
        flat
        @click="$router.push({ name: 'login' })"
        >login</v-btn
      >

      <AppBarMenu
        v-if="isAuthenticated()"
        :user="user_email"
        :logout="logout"
      />
    </template>
  </v-app-bar>
</template>

<script>
import AppBarMenu from "./AppBarMenu.vue";
import logo from "@/assets/logo.svg";

// store
import { useAuthStore } from "@/store/auth.js";
import { useAppStore } from "@/store/app.js";
import { mapState, mapActions } from "pinia";

export default {
  components: {
    AppBarMenu,
  },
  data() {
    return {
      logo,
    };
  },

  computed: {
    ...mapState(useAuthStore, ["user_email"]),
    ...mapState(useAppStore, ["currentProject"]),
  },
  methods: {
    ...mapActions(useAuthStore, ["logout", "isAuthenticated"]),
    refresh: function () {
      this.$router.push("/");
    },
  },
};
</script>

<style>
.app-bar-logo:hover {
  cursor: pointer;
}

.toolbar-title {
  margin-left: 15px;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.75rem;
  text-transform: none;
}
</style>
