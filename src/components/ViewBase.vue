<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" class="d-flex justify-start mt-1">
        <p class="text-h4">{{ title }}</p>
      </v-col>
      <v-col cols="2" class="d-flex justify-start">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" xl="5" class="d-flex flex-row" v-if="!onlyView">
        <v-btn
          size="x-large"
          variant="text"
          @click="openManage"
          color="success"
          >{{ createTitle }}</v-btn
        >
        <v-text-field
          class="ml-3"
          clearable
          clear-icon="mdi-close"
          variant="outlined"
          append-inner-icon="mdi-magnify"
          placeholder="Search"
          v-model="filterText"
          type="text"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" :key="attTable">
        <v-table theme="dark">
          <thead>
            <tr>
              <th class="text-left" v-for="label in labels">{{ label }}</th>
              <th class="text-center">Opções</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="object in filtered" :key="object.id">
              <td v-for="key in keys">
                <template v-if="typeof object[key] === 'boolean'">
                  <v-icon v-if="object[key] === true" color="green"
                    >mdi-check</v-icon
                  >
                  <v-icon v-else color="red">mdi-close</v-icon>
                </template>
                <template v-else>
                  {{ object[key] }}
                </template>
              </td>
              <td class="text-center">
                <v-btn
                  v-if="isRealmPage"
                  :color="
                    definedChoosenRealm == object['name'] ? 'green' : 'white'
                  "
                  @click="setSelectedRealm(object['name'])"
                  size="x-small"
                  icon
                  ><v-icon
                    >{{
                      definedChoosenRealm == object["name"]
                        ? "mdi-check"
                        : "mdi-radiobox-blank"
                    }}
                  </v-icon></v-btn
                >
                <v-btn
                  color="primary"
                  size="x-small"
                  icon
                  text
                  class="ml-1"
                  v-if="!onlyView"
                  @click="handleModal('edit', object)"
                  ><v-icon>mdi-pencil</v-icon></v-btn
                >
                <v-btn
                  color="error"
                  size="x-small"
                  icon
                  class="ml-1"
                  v-if="!onlyView"
                  @click="handleModal('delete', object)"
                  ><v-icon>mdi-delete</v-icon></v-btn
                >
                <v-btn
                  color="info"
                  size="x-small"
                  icon
                  class="ml-1"
                  @click="handleModal('info', object)"
                  ><v-icon>mdi-information-outline</v-icon></v-btn
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <Pagination :currentPage="page" :lastPage="lastPage" @paginate="paginate" />
    <ModalEdit
      v-if="isModalEditOpen"
      :isOpen="isModalEditOpen"
      :info="ModalEdit"
      :object="selectedObject"
      @closeModal="handleModal('edit')"
    />
    <ModalDelete
      v-if="isModalDeleteOpen"
      :isOpen="isModalDeleteOpen"
      :title="deleteBase.title"
      :resource="modalInfo.title"
      :message="deleteBase.message"
      @delete="responseFromModal"
    />
    <ModalInfo
      v-if="isModalInfoOpen"
      :isOpen="isModalInfoOpen"
      :info="modalInfo"
      :object="selectedObject"
      @closeModal="handleModal('info')"
    />
  </v-container>
</template>

<script>
import ModalEdit from "@/components/modal/ModalEdit.vue";
import ModalDelete from "@/components/modal/ModalDelete.vue";
import ModalInfo from "@/components/modal/ModalInfo.vue";
import Pagination from "@/components/Pagination.vue";
import { useAppStore } from "@/store/app";
export default {
  components: {
    ModalInfo,
    ModalDelete,
    ModalEdit,
    Pagination,
  },
  created() {
    this.appStore = useAppStore();
    this.definedChoosenRealm = this.appStore.getChoosenRealm;
  },

  computed: {
    filtered() {
      const filtered =
        this.filterText && this.filterText != ""
          ? this.objects.filter((obj) => {
              if (
                obj &&
                (obj.hasOwnProperty("name") || obj.hasOwnProperty("username"))
              ) {
                const key = obj.hasOwnProperty("username")
                  ? "username"
                  : "name";
                return obj[key]
                  .toLowerCase()
                  .includes(this.filterText.toLowerCase());
              }

              return obj;
            })
          : this.objects;
      return filtered;
    },
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    createTitle: {
      type: String,
      required: true,
    },
    objects: {
      type: Array,
      required: true,
    },
    labels: {
      type: Array,
      required: true,
    },
    keys: {
      type: Array,
      required: true,
    },
    ModalEdit: {
      type: Object,
      required: false,
    },
    modalDelete: {
      type: Object,
      required: false,
    },
    modalInfo: {
      type: Object,
      required: false,
    },
    page: {
      type: Number,
      default: 1,
    },
    lastPage: {
      type: Number,
      default: 1,
    },
    isRealmPage: {
      type: Boolean,
      default: false,
    },
    onlyView: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isModalEditOpen: false,
      isModalDeleteOpen: false,
      isModalInfoOpen: false,
      selectedObject: {},
      idDelete: null,
      filterText: "",
      choosenRealm: null,
      appStore: null,
      definedChoosenRealm: null,
      attTable: 1,
      deleteBase: {
        message: "Deseja realmente deletar esse registro ?",
        title: "Deletar Registro",
      },
    };
  },
  methods: {
    handleModal(type, object) {
      console.log("aa");
      this.selectedObject = object;

      switch (type) {
        case "edit":
          this.$emit("edit", object);
          break;
        case "delete":
          this.isModalDeleteOpen = !this.isModalDeleteOpen;
          this.idDelete = object.id;
          break;
        case "info":
          this.isModalInfoOpen = !this.isModalInfoOpen;
          break;
      }
    },

    setSelectedRealm(realm) {
      this.appStore.setChoosenRealm(realm);
      this.definedChoosenRealm = realm;
      this.attTable += 1;
    },

    responseFromModal(event) {
      if (event) {
        console.log(event);
        this.$emit("delete", this.idDelete);
      }
      this.idDelete = null;
    },

    openManage() {
      this.$emit("openManage", true);
    },

    paginate(page) {
      this.$emit("paginate", page);
    },
  },
};
</script>
