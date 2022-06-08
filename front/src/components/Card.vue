<template lang="pt-br">
    <b-card
    :title="title"
    :img-src="image"
    :img-alt="imageAlt"
    img-top
    style="max-width: 12rem"
    class="mb-5 text-center"
  >
    <slot />
  </b-card>
</template>
<script>
export default {
    props: {
    title: String,
    image: String,
    imageAlt: String,
  },
}
</script>
<style scoped>
    .mb-5 {
        padding-bottom: 0.7rem;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
        align-items: center;
    }
        .card-img-top {
        width: 7rem !important;
    }
</style>