<template lang="pug">
    .grey--text.pl-3
        v-layout(justify-space-between, align-baseline)
            span(v-if="remainingItems === -1" )
            span(v-if="remainingItems >=0" ) {{ remainingItems | pluralize }} left
            span
                v-btn-toggle
                    v-btn(small, flat, value='', @click="$emit('filter-items')") All
                    v-btn(small, flat, value='active', @click="$emit('filter-items', 'active')") Active
                    v-btn(small, flat, value='completed', @click="$emit('filter-items', 'completed')") Completed
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
