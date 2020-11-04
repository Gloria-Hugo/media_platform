import Vue from "vue";
import VueRouter from "vue-router";
const Home = resolve => require(["../views/Home.vue"], resolve);

// 这是需求方的页面路由
const Demand = resolve => require(["../views/Demand.vue"], resolve);
const Login = resolve => require(["../views/Login.vue"], resolve);
const Message = resolve => require(["../views/Messages.vue"], resolve);
// const Register = resolve => require(["../views/Register.vue"], resolve);
const Needs = resolve => require(["../components/demand/Needs.vue"], resolve);
const CreateNeeds = resolve =>
  require(["../components/demand/CreateNeeds.vue"], resolve);
const MyService = resolve =>
  require(["../components/demand/MyService.vue"], resolve);
const NeedsDetail = resolve =>
  require(["../components/demand/NeedsDetail.vue"], resolve);
const Statistics = resolve =>
  require(["../components/demand/Statistics.vue"], resolve);

// 这是管理员的页面路由
const Admin = resolve => require(["../views/Admin.vue"], resolve);
const DemandUserManager = resolve =>
  require(["../components/admin/DemandUserManager.vue"], resolve);
const ContractorUserManager = resolve =>
  require(["../components/admin/ContractorUserManager.vue"], resolve);
const CanalUserManager = resolve =>
  require(["../components/admin/CanalUserManager.vue"], resolve);
// const UserManager = resolve =>
//   require(["../components/admin/UserManager.vue"], resolve);
const ContentManager = resolve =>
  require(["../components/admin/ContentManager.vue"], resolve);
const ContentDetail = resolve =>
  require(["../components/admin/Details.vue"], resolve);
const ProjectManager = resolve =>
  require(["../components/admin/ProjectManager.vue"], resolve);
const SectionManager = resolve =>
  require(["../components/admin/SectionManager.vue"], resolve);
const TypeManager = resolve =>
  require(["../components/admin/TypeManager.vue"], resolve);
const BalanceManager = resolve =>
  require(["../components/admin/BalanceManager.vue"], resolve);
const SourceManager = resolve =>
  require(["../components/admin/SourceManager.vue"], resolve);

// 这里是承接方的页面路由 DemandUserManager
const Contractor = resolve => require(["../views/Contractor.vue"], resolve);
const MyManuscript = resolve =>
  require(["../components/contractor/MyManuscript.vue"], resolve);
const CountingManager = resolve =>
  require(["../components/contractor/CountingManager.vue"], resolve);
const ContractorNeedsDetail = resolve =>
  require(["../components/contractor/NeedsDetail.vue"], resolve);

//这是渠道方的页面路由
const Canal = resolve => require(["../views/Canal.vue"], resolve);
const CanalContentManager = resolve =>
  require(["../components/canal/ContentManager.vue"], resolve);
const CanalCountingManager = resolve =>
  require(["../components/canal/CountingManager.vue"], resolve);
const CanalNeedsDetails = resolve =>
  require(["../components/canal/NeedsDetail.vue"], resolve);

// 这是结算人员的页面
const Bookkeeper = resolve => require(["../views/Bookkeeper.vue"], resolve);

const Accountant = resolve =>
  require(["../components/keeper/BalanceManager.vue"], resolve);
Vue.use(VueRouter);
const router = new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      meta: {
        type: ""
      }
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: {
        type: ""
      }
    },
    {
      path: "/demand",
      name: "Demand",
      component: Demand,
      children: [
        {
          path: "/demand/needs",
          name: "needs",
          component: Needs,
          meta: {
            type: "login"
          }
        },
        {
          path: "/demand/createneeds",
          name: "create",
          component: CreateNeeds,
          meta: {
            type: "login"
          }
        },
        {
          path: "/demand/myservice",
          name: "myservice",
          component: MyService,
          meta: {
            type: "login"
          }
        },
        {
          path: "/demand/needsdetail",
          name: "needsdetail",
          component: NeedsDetail,
          meta: {
            type: "login"
          }
        },
        {
          path: "/demand/statistics",
          name: "Statistics",
          component: Statistics,
          meta: {
            type: "login"
          }
        },
        {
          // 消息中心
          path: "/demand/mymessages",
          name: "mymessages",
          component: Message,
          meta: {
            type: "login"
          }
        }
      ]
    },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      children: [
        {
          path: "/admin/demandusermanager",
          name: "DemandUserManager",
          component: DemandUserManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/contractorcsermanager",
          name: "ContractorUserManager",
          component: ContractorUserManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/canalusermanager",
          name: "CanalUserManager",
          component: CanalUserManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/contentmanager",
          name: "ContentManager",
          component: ContentManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/contentmanager/details",
          name: "ContentDetail",
          component: ContentDetail,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/projectmanager",
          name: "ProjectManager",
          component: ProjectManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/sectionmanager",
          name: "SectionManager",
          component: SectionManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/typemanager",
          name: "TypeManager",
          component: TypeManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/balancemanager",
          name: "BalanceManager",
          component: BalanceManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/admin/sourcemanager",
          name: "SourceManager",
          component: SourceManager,
          meta: {
            type: "login"
          }
        },
        {
          // 消息中心
          path: "/admin/mymessages",
          name: "mymessages",
          component: Message,
          meta: {
            type: "login"
          }
        }
      ]
    },
    {
      path: "/contractor",
      name: "Contractor",
      component: Contractor,
      children: [
        {
          path: "/contractor/mymanuscript",
          name: "MyManuscript",
          component: MyManuscript,
          meta: {
            type: "login"
          }
        },
        {
          path: "/contractor/needsdetail",
          name: "cneedsdetail",
          component: ContractorNeedsDetail,
          meta: {
            type: "login"
          }
        },
        {
          path: "/contractor/countingmanager",
          name: "countingmanager",
          component: CountingManager,
          meta: {
            type: "login"
          }
        },
        {
          // 消息中心
          path: "/contractor/mymessages",
          name: "mymessages",
          component: Message,
          meta: {
            type: "login"
          }
        }
      ]
    },
    {
      path: "/canal",
      name: "canal",
      component: Canal,
      children: [
        {
          path: "/canal/contentmanager",
          name: "contentcontentmanager",
          component: CanalContentManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/canal/countingmanager",
          name: "contentcountingmanager",
          component: CanalCountingManager,
          meta: {
            type: "login"
          }
        },
        {
          path: "/canal/needsdetails",
          name: "canalneedsdetails",
          component: CanalNeedsDetails,
          meta: {
            type: "login"
          }
        },
        {
          // 消息中心 CanalNeedsDetails
          path: "/canal/mymessages",
          name: "mymessages",
          component: Message,
          meta: {
            type: "login"
          }
        }
      ]
    },
    {
      path: '/keeper',
      name: 'keeper',
      component: Bookkeeper,
      children: [
        {
          path:'/keeper/countingmanager',
          name: "keeper_countingmanager",
          component: Accountant,
          meta: {
            type: 'login'
          }
        },
        {
          // 消息中心 CanalNeedsDetails
          path: "/keeper/mymessages",
          name: "keeper_mymessages",
          component: Message,
          meta: {
            type: "login"
          }
        }
      ]
    }
  ]
});

export default router;
