<template>
    <div class="text-center">
        <v-pagination v-model="page" :length="length" :total-visible="7"></v-pagination>
    </div>
</template>
<script>
export default {
    props: {
        currentPage: {
            type: Number,
            default: 1
        },
        lastPage: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            page: this.currentPage,
            length: this.lastPage
        }
    },
    watch: {
        page() {
            this.$emit('paginate', this.page)
        }
    }
}
</script>
