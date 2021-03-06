<template>
    <div>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6" >
                <v-card>
                    <v-card-title class="headline">
                        Movie List 
                        <v-spacer></v-spacer>
                        <v-btn small fab color="primary" @click="getMovieList">
                            <v-icon>mdi-refresh</v-icon>
                        </v-btn>
                    </v-card-title>
                    
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center" align="center">
            <v-col cols="12" sm="8" md="6">
                <div class="text-center">
                    <MovieTableSearch @show-search-list="getSearchResult"></MovieTableSearch>
                    <MovieTable :movieList="movieList" :loading = "loading" @update-table="updateTable"></MovieTable>
                    <MovieTablePage @show-page-list="getPageMovieList" :pageData = "pageData"></MovieTablePage>
                </div>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import { find, findIndex, cloneDeep } from 'lodash';
import axios from 'axios';
import { defineComponent, reactive, onMounted, ref } from '@nuxtjs/composition-api'
import MovieTable from '~/components/movie/table.vue'
import MovieTablePage from '~/components/movie/page.vue'
import MovieTableSearch from '~/components/movie/search.vue'
import  favStore  from '~/global_store/favStore'

export default defineComponent({
    components: {
        MovieTable,
        MovieTablePage,
        MovieTableSearch
    },
    props: {
        movListProp: {
            type: Array,
            default: null
        },
      movPageProp: {
            type: Object,
            default: null
        },
      loadingProp: {
            type: Boolean,
            default: true
        }
    },
    setup( props , context) {
        const movTitle = ref("");
        const page = ref(1);
        const pageData: any = !!!!props.movPageProp? ref(props.movPageProp) : ref({});
        const loading =  !!props.loadingProp? ref(props.loadingProp) : ref(true);
        const movieList:any = !!props.movListProp? ref(props.movListProp) : ref([]);

        function updateTable(){
            const storedFavList = favStore.getFavList.value;
            let movList: any[] = cloneDeep(movieList.value);
            for (let i = 0; i < movList.length; i++) {
                movList[i]["favourite"] = !!find(storedFavList, { imdbID: movList[i].imdbID });
            }
            movieList.value = movList;
        }
        function getPageMovieList(pageNo: number) {
            page.value = pageNo;
            getMovieList();
        }
        function getSearchResult(searchTxt: string) {
            movTitle.value = searchTxt;
            page.value = 1;
            getMovieList();
        }
        function getMovieList() {
            loading.value = true;
            let storedFavList = favStore.getFavList.value;
            let resData;
            let movieObj;
            axios({
                method: 'get',
                baseURL: "https://jsonmock.hackerrank.com/api/movies/search",
                url: `/?Title=${movTitle.value}&page=${page.value}`,
            })
                .then(response => {
                    resData = response.data;
                    resData.page = Number(resData.page);
                    for (let i = 0; i < resData.data.length; i++){
                        movieObj = resData.data[i];
                        resData.data[i]["favourite"] = !!find(storedFavList, { imdbID : movieObj.imdbID });
                    }
                    movieList.value = resData.data;
                    loading.value = false;
                    const { data, ...pageObj } = resData
                    pageData.value = pageObj;
                }, err => {
                    console.log(err);
                });
        }
        onMounted(() => {
            getMovieList();
        });
        return {
            getMovieList,
            getPageMovieList,
            getSearchResult,
            updateTable,
            movieList,
            pageData,
            loading
        }
    }
})
</script>