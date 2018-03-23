<template lang="pug">
    .grey--text.pl-3
        v-layout(justify-space-between, align-baseline)
            span(v-if="remainingItems === -1" )
            span(v-if="remainingItems >= 0" ) {{ remainingItems | pluralize }} left
            span
                v-btn-toggle(v-model="selectedFilter")
                    v-btn(small, flat, value='', to="/all") All
                    v-btn(small, flat, value='active', to="/active") Active
                    v-btn(small, flat, value='completed', to="/completed") Completed
            span
                v-btn(flat, color="grey", @click="$emit('clear-completed')") Clear completed

</template>

<script>
    export default {
        props: {
            remainingItems: Number,
        },
        data() {
            return {
                selectedFilter: 0,
            }
        },
        filters: {
            pluralize(v, singular = 'item', plural = singular +'s') {
                return v + ' ' + (v > 1 || v === 0 ? plural : singular)
            }
        }
    }
</script>
