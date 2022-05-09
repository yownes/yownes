import type { RoutePath } from "../components/organisms/Router";
import Builds from "../pages/admin/Builds";
import Client from "../pages/admin/Client";
import Clients from "../pages/admin/Clients";
import NewPlan from "../pages/admin/NewPlan";
import NewTemplate from "../pages/admin/NewTemplate";
import Plan from "../pages/admin/Plan";
import Plans from "../pages/admin/Plans";
import Profile from "../pages/admin/Profile";
import Template from "../pages/admin/Template";
import Templates from "../pages/admin/Templates";
import NotFound from "../pages/NotFound";

const routes: RoutePath[] = [
  {
    exact: true,
    path: "/",
    redirect: "/clients",
    admin: true,
  },
  {
    exact: true,
    path: "/builds",
    name: "Builds",
    component: Builds,
    admin: true,
  },
  {
    exact: true,
    path: "/clients",
    name: "Clientes",
    component: Clients,
    admin: true,
  },
  {
    exact: true,
    path: "/clients/:id",
    name: "Cliente",
    component: Client,
    admin: true,
  },
  {
    exact: true,
    path: "/templates",
    name: "Plantillas",
    component: Templates,
    admin: true,
  },
  {
    exact: true,
    path: "/templates/new",
    name: "Nueva Plantilla",
    component: NewTemplate,
    admin: true,
  },
  {
    exact: false,
    path: "/templates/:id",
    name: "Plantilla",
    component: Template,
    admin: true,
  },
  {
    exact: true,
    path: "/planes",
    name: "Planes",
    component: Plans,
    admin: true,
  },
  {
    exact: true,
    path: "/planes/new",
    name: "Nuevo Plan",
    component: NewPlan,
    admin: true,
  },
  {
    exact: false,
    path: "/planes/:id",
    name: "Plan",
    component: Plan,
    admin: true,
  },
  {
    exact: true,
    path: "/profile",
    name: "Perfil",
    component: Profile,
    admin: true,
  },
  {
    exact: false,
    path: "*",
    name: "Error 404",
    component: NotFound,
    admin: true,
  },
];

export default routes;
