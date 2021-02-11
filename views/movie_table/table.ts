import { defineComponent, computed, useMeta, ref } from '@nuxtjs/composition-api'
import AddToFav from '~/components/add_to_fav.vue'

export default defineComponent({
    components: {
        AddToFav,
    },
    props: {
        movieData: {
            type: Object,
            default: null
        }
    },

    setup({ movieData}, context) {
        
        console.log(movieData);
        
        const options = ref({});

        const movieHeaders = ref([
            {
                text: 'Title',
                align: 'left',
                sortable: false,
                value: 'Title',
            },
            {
                text: 'Year',
                align: 'start',
                sortable: false,
                value: 'Year',
            },
            {
                text: 'IMDB ID',
                align: 'start',
                sortable: false,
                value: 'imdbID',
            },
            { 
                text: '', 
                value: 'favourite',
                align: 'start',
                sortable: false,
            },
        ]);
        
       
        
        const page = ref(1);
        const itemsPerPage = ref(10);

        
        return {
            movieHeaders,
            options,
            itemsPerPage,
            page
        }
    }
})
