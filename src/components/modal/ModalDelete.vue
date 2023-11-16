<template>
  <ModalBase :isOpen="dialog" :title="info?.title" :needsClose="false">
    <v-card>
      <v-row>
        <v-col cols="12">
          <v-card-title>
            <span class="text-h6"> {{ title }} de [{{ formatResource }}] </span>
          </v-card-title>
        </v-col>
        <v-col cols="12">
          <v-card-text>
            <div v-if="isArrayMessage">
              <div v-for="(msg, index) in message" :key="index">
                {{ msg }}
              </div>
            </div>
            <div v-else>
              <span class="text-subtitle-1 pl-8">{{ message }}</span>
            </div>
          </v-card-text>
        </v-col>
        <v-col cols="12">
          <v-card-actions class="d-flex justify-end">
            <v-btn color="red darken-1" text @click.native="agree">{{
              "Sim"
            }}</v-btn>
            <v-btn color="green darken-1" text @click.native="cancel">{{
              "Não"
            }}</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </ModalBase>
</template>

<script>
import ModalBase from "@/components/modal/ModalBase.vue";

export default {
  components: {
    ModalBase,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
  },
  computed: {
    isArrayMessage() {
      return this.message && this.message instanceof Array;
    },

    formatResource() {
      console.log(this.resource);
      return this.resource.split(" ").slice(-1)[0];
    },
  },
  mounted() {
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  },
  methods: {
    agree() {
      this.resolve(true);
      this.$emit("delete", true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.$emit("delete", false);
      this.dialog = false;
    },
  },
  data() {
    return {
      dialog: this.isOpen,
      options: {
        color: "error",
        width: 390,
        zIndex: 200,
      },
    };
  },
  watch: {
    isOpen(value) {
      this.dialog = value;
    },
  },
};
</script>
