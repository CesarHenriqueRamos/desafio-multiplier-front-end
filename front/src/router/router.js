import Vue from "vue";
import Router from 'vue-router'
//pages
import Home from '../pages/Home'
import Captured from '../pages/Captured'

Vue.use(Router)

export default new Router({
    mode:'history',
    routes:[
        {
            path:'/',
            component:Home
            
        },
        {
            path:'/captured',
            component:Captured
        }
    ]
})