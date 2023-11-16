<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
    @click:outside="closeModal"
    :persistent="needsClose ? false : true"
  >
    <v-card v-if="needsClose">
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn @click="closeModal">Fechar</v-btn>
      </v-card-actions>
    </v-card>
    <div v-else><slot></slot></div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    needsClose: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialog: this.isOpen,
    };
  },
  watch: {
    isOpen(value) {
      this.dialog = value;
    },
  },
  methods: {
    closeModal() {
      console.log("aa Close Modal");
      this.$emit("closeModal");
    },
  },
};
</script>
