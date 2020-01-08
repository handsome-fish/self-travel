import Vue from 'vue'
import Router from 'vue-router'
import login from '../views/login'
import register from '../views/register'
import spotManage from '../views/admin/spotManage'
import ticketManage from "../views/admin/ticketManage"
import admin from '../components/admin'
import commentManage from "../views/spotAdmin/commentManage"
import user from "../components/user"
import spot from "../views/user/spot";
import spotAdmin from "../components/spotAdmin";
import adminInfo from "../views/admin/adminInfo";
import levelManage from "../views/admin/levelManage";
import spotManageAdmin from "../views/spotAdmin/spotManageAdmin";
import recommendRoute from "../views/spotAdmin/recommendRoute";
import spotService from "../views/spotAdmin/spotService";
import memberInfo from "../views/user/memberInfo";
import orderManage from "../views/user/orderManage";
import spotAdminInfo from "../views/spotAdmin/spotAdminInfo";
import ticketManageAdmin from "../views/spotAdmin/ticketManageAdmin"
import spotNav from "../components/spotNav"
import spotNavComment from "../views/user/spotNav/spotNavComment";
import spotNavQuestion from "../views/user/spotNav/spotNavQuestion";
import spotNavSpotInfo from "../views/user/spotNav/spotNavSpotInfo";
import spotNavSpotService from "../views/user/spotNav/spotNavSpotService";
import spotNavTicketInfo from "../views/user/spotNav/spotNavTicketInfo";
import orderStateManage from "../views/spotAdmin/orderStateManage";
import albumComment from "../components/albumComment";
import commentInput from "../components/commentInput";
import spotServiceDetail from "../views/user/spotNav/spotServiceDetail";
import recommendation from "../views/user/recommendation";

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path:'/admin',
      name:'admin',
      component: admin,
      children:[
        {
          path: '/spotManage',
          name: 'spotManage',
          component: spotManage
        },
        {
          path: '/levelManage',
          name: 'levelManage',
          component: levelManage
        },
        {
          path: '/adminInfo',
          name: 'adminInfo',
          component: adminInfo
        }
      ]
    },
    {
      path: '/',
      name: 'user',
      component: user,
      children: [
        {
          path: '/',
          name: 'spot',
          component: spot
        },
        {
          path: '/orderManage',
          name: 'orderManage',
          component: orderManage
        },
        {
          path: '/memberInfo',
          name: 'memberInfo',
          component: memberInfo
        },
        {
          path: '/recommendation',
          name: 'recommendation',
          component: recommendation
        },
        {
          path: '/spotNav',
          name: 'spotNav',
          component: spotNav,
          children: [
            {
              path: '/spotNavSpotInfo',
              name: 'spotNavSpotInfo',
              component: spotNavSpotInfo
            },
            {
              path: '/spotNavTicketInfo',
              name: 'spotNavTicketInfo',
              component: spotNavTicketInfo
            },
            {
              path: '/spotNavSpotService',
              name: 'spotNavSpotService',
              component: spotNavSpotService
            },
            {
              path: '/spotNavQuestion',
              name: 'spotNavQuestion',
              component: spotNavQuestion
            },
            {
              path: '/spotNavComment',
              name: 'spotNavComment',
              component: spotNavComment
            },
            {
              path: '/spotServiceDetail',
              name: 'spotServiceDetail',
              component: spotServiceDetail
            }
          ]
        }
      ]
    },
    {
      path: '/spotAdmin',
      name: 'spotAdmin',
      component: spotAdmin,
      children: [
        {
          path: '/spotManageAdmin',
          name: 'spotManageAdmin',
          component: spotManageAdmin
        },
        {
          path: '/ticketManageAdmin',
          name: 'ticketManageAdmin',
          component: ticketManageAdmin
        },
        {
          path: '/spotService',
          name: 'spotService',
          component: spotService
        },
        {
          path: '/recommendRoute',
          name: 'recommendRoute',
          component: recommendRoute
        },
        {
          path: '/commentManage',
          name: 'commentManage',
          component: commentManage
        },
        {
          path: '/orderStateManage',
          name: 'orderStateManage',
          component: orderStateManage
        },
        {
          path: '/spotAdminInfo',
          name: 'spotAdminInfo',
          component: spotAdminInfo
        }
      ]
    },
    {
      path: '/albumComment',
      name: 'albumComment',
      component: albumComment
    },
    {
      path: '/commentInput',
      name: 'commentInput',
      component: commentInput
    }
  ]
})
