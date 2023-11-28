<template>
  <ModalBase :isOpen="dialog" :title="info.title" :persistent="true">
    <slot v-if="object">
      <v-row>
        <v-col
          cols="12"
          v-for="(key, index) in info.keys"
          :key="index"
          class="table-row"
        >
          <div
            class="d-flex justify-center"
            :class="
              info.labels[index] == 'Descrição' || info.labels[index] == 'Token'
                ? 'flex-column'
                : 'flex-row align-center'
            "
          >
            <div class="label mr-1">{{ info.labels[index] }}:</div>
            <template v-if="isBoolean(key)">
              <v-icon v-if="object[key] === true" color="green"
                >mdi-check</v-icon
              >
              <v-icon v-else color="red">mdi-close</v-icon>
            </template>
            <template v-else-if="isDatetime(key)">
              {{ convertData(object[key]) }}
            </template>
            <template v-else>
              <p class="text-left">
                {{ object[key] }}
              </p>
            </template>
          </div>
        </v-col>
      </v-row>
    </slot>
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
    info: {
      type: Object,
      required: true,
    },
    object: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: this.isOpen,
    };
  },
  methods: {
    isBoolean(key) {
      return typeof this.object[key] === "boolean";
    },
    isDatetime(key) {
      return ["created_at", "updated_at"].includes(key);
    },

    convertData(key) {
      key = new Date(key);
      return key
        .toLocaleString("pt-BR")
        .replace(/\//g, "/")
        .replace(", ", " - ");
    },
  },
  watch: {
    isOpen(value) {
      this.dialog = value;
    },
  },
};
</script>

<style>
.table-row {
  display: flex;
  margin-bottom: 8px;
}

.label {
  font-weight: bold;
  text-align: left;
}

.key {
  text-align: left;
}
</style>
