import { RoutePath } from "../components/organisms/Router";
import Validate from "../pages/auth/Validate";
import App from "../pages/client/App";
import Checkout from "../pages/client/Checkout";
import EditProfile from "../pages/client/EditProfile";
import NewApp from "../pages/client/NewApp";
import Profile from "../pages/client/Profile";
import NotFound from "../pages/NotFound";

const routes: RoutePath[] = [
  {
    exact: true,
    path: "/",
    redirect: "/profile",
    admin: false,
  },
  {
    exact: true,
    path: "/profile",
    name: "Panel principal",
    component: Profile,
    admin: false,
  },
  {
    exact: true,
    path: "/profile/edit",
    name: "Perfil",
    component: EditProfile,
    admin: false,
  },
  {
    exact: true,
    path: "/checkout",
    name: "Suscripción",
    component: Checkout,
    admin: false,
  },
  {
    exact: true,
    path: "/app/new",
    name: "Creador de App",
    component: NewApp,
    admin: false,
  },
  {
    exact: false,
    path: "/app/:appId",
    name: "Editor de App",
    component: App,
    admin: false,
  },
  {
    exact: true,
    path: "/activate/:token",
    name: "Activar Cuenta",
    component: Validate,
    admin: false,
  },
  {
    exact: false,
    path: "*",
    name: "Error 404",
    component: NotFound,
    admin: false,
  },
];

export default routes;
