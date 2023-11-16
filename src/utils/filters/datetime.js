import Vue from "vue";
import moment from "moment-js";

Vue.filter("formatDateTime", function (value) {
    if (value) {
        return moment(String(value)).format("DD/MM/YYYY • HH:mm:ss");
    }
});

Vue.filter("formatDate", function (value) {
    if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
    }
});

export default {
    formatDateTime: Vue.filter("formatDateTime"),
    formatDate: Vue.filter("formatDate"),
}
