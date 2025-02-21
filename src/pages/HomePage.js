import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { Routes } from "../routes";

// pages
import Presentation from "./Presentation";
import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import Settings from "./Settings";
import BootstrapTables from "./tables/BootstrapTables";
import Signin from "./examples/Signin";
import Signup from "./examples/Signup";
import ForgotPassword from "./examples/ForgotPassword";
import ResetPassword from "./examples/ResetPassword";
import Lock from "./examples/Lock";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";

// documentation pages
import DocsOverview from "./documentation/DocsOverview";
import DocsDownload from "./documentation/DocsDownload";
import DocsQuickStart from "./documentation/DocsQuickStart";
import DocsLicense from "./documentation/DocsLicense";
import DocsFolderStructure from "./documentation/DocsFolderStructure";
import DocsBuild from "./documentation/DocsBuild";
import DocsChangelog from "./documentation/DocsChangelog";

// components
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";

import Accordion from "./components/Accordion";
import Alerts from "./components/Alerts";
import Badges from "./components/Badges";
import Breadcrumbs from "./components/Breadcrumbs";
import Buttons from "./components/Buttons";
import Forms from "./components/Forms";
import Modals from "./components/Modals";
import Navs from "./components/Navs";
import Navbars from "./components/Navbars";
import Pagination from "./components/Pagination";
import Popovers from "./components/Popovers";
import Progress from "./components/Progress";
import Tables from "./components/Tables";
import Tabs from "./components/Tabs";
import Tooltips from "./components/Tooltips";
import Toasts from "./components/Toasts";
import { useDispatch, useSelector } from 'react-redux';
import Users from './Users';
import Services from './Services';
import EmergencyServices from './EmergencyServices';
import Chat from './Chat';
import Pending from './requests/Pending'
import InProgress from './requests/InProgress'
import ResolvedRequests from './requests/Resolved'
import Config from './Config';
import { messaging, onMessage, requestPermission } from '../config/firebase';
import { validateToken } from '../features/adminSlice';
import {addNewMessage} from "../features/communicationSlice";
import { useAlert } from 'react-alert';
import { playMessageIncomingSound } from '../utils/playSound';
import useSocket from '../services/socket.service';


const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Route {...rest} render={props => (<> <Preloader show={loaded ? false : true} /> <Component {...props} /> </>)} />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  if(!localStorage.getItem('token')){
    return <Redirect to={Routes.Signin.path} />
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          <Footer />
        </main>
      </>
    )}
    />
  );
};

export default () => {
  const notifyAlert = useAlert()
  const { adminInfo } = useSelector(state => state.admin);
    const { currentChat, loading, userList, userId } = useSelector((state) => state.communication);
  const dispatch = useDispatch();
  const history = useHistory();
  const adminId = localStorage.getItem("betser-admin");
  useSocket(adminId)

  useEffect(() => {
    if (!adminInfo?.token && localStorage.getItem("token")) {
      dispatch(validateToken());
    }
    else if (!localStorage.getItem("token")) {
      history.push("/sign-in")
    }
  }, [])

  useEffect(() => {
    requestPermission();
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      alert(`New Notification: ${payload.notification.title} - ${payload.notification.body}`);
    });
  }, [adminInfo])


  return (
    <Switch>
      <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
      <RouteWithLoader exact path={Routes.Signup.path} component={Signup} />
      <RouteWithLoader exact path={Routes.ForgotPassword.path} component={ForgotPassword} />
      <RouteWithLoader exact path={Routes.ResetPassword.path} component={ResetPassword} />
      <RouteWithLoader exact path={Routes.Lock.path} component={Lock} />
      <RouteWithLoader exact path={Routes.NotFound.path} component={NotFoundPage} />
      <RouteWithLoader exact path={Routes.ServerError.path} component={ServerError} />

      {/* pages */}
      <RouteWithSidebar exact path={Routes.DashboardOverview.path} component={DashboardOverview} />
      <RouteWithSidebar exact path={Routes.Upgrade.path} component={Upgrade} />
      <RouteWithSidebar exact path={Routes.Chat.path} component={Chat} />
      <RouteWithSidebar exact path={Routes.ChatId.path} component={Chat} />
      <RouteWithSidebar exact path={Routes.Users.path} component={Users} />
      <RouteWithSidebar exact path={Routes.Services.path} component={Services} />
      <RouteWithSidebar exact path={Routes.Config.path} component={Config} />
      <RouteWithSidebar exact path={Routes.EmergencyServices.path} component={EmergencyServices} />
      <RouteWithSidebar exact path={Routes.Profile.path} component={Settings} />
      <RouteWithSidebar exact path={Routes.BootstrapTables.path} component={BootstrapTables} />
      <RouteWithSidebar exact path={Routes.PendingRequests.path} component={Pending} />
      <RouteWithSidebar exact path={Routes.ProgressRequests.path} component={InProgress} />
      <RouteWithSidebar exact path={Routes.ResolvedRequests.path} component={ResolvedRequests} />

      {/* components */}
      <RouteWithSidebar exact path={Routes.Accordions.path} component={Accordion} />
      <RouteWithSidebar exact path={Routes.Alerts.path} component={Alerts} />
      <RouteWithSidebar exact path={Routes.Badges.path} component={Badges} />
      <RouteWithSidebar exact path={Routes.Breadcrumbs.path} component={Breadcrumbs} />
      <RouteWithSidebar exact path={Routes.Buttons.path} component={Buttons} />
      <RouteWithSidebar exact path={Routes.Forms.path} component={Forms} />
      <RouteWithSidebar exact path={Routes.Modals.path} component={Modals} />
      <RouteWithSidebar exact path={Routes.Navs.path} component={Navs} />
      <RouteWithSidebar exact path={Routes.Navbars.path} component={Navbars} />
      <RouteWithSidebar exact path={Routes.Pagination.path} component={Pagination} />
      <RouteWithSidebar exact path={Routes.Popovers.path} component={Popovers} />
      <RouteWithSidebar exact path={Routes.Progress.path} component={Progress} />
      <RouteWithSidebar exact path={Routes.Tables.path} component={Tables} />
      <RouteWithSidebar exact path={Routes.Tabs.path} component={Tabs} />
      <RouteWithSidebar exact path={Routes.Tooltips.path} component={Tooltips} />
      <RouteWithSidebar exact path={Routes.Toasts.path} component={Toasts} />

      {/* documentation */}
      <RouteWithSidebar exact path={Routes.DocsOverview.path} component={DocsOverview} />
      <RouteWithSidebar exact path={Routes.DocsDownload.path} component={DocsDownload} />
      <RouteWithSidebar exact path={Routes.DocsQuickStart.path} component={DocsQuickStart} />
      <RouteWithSidebar exact path={Routes.DocsLicense.path} component={DocsLicense} />
      <RouteWithSidebar exact path={Routes.DocsFolderStructure.path} component={DocsFolderStructure} />
      <RouteWithSidebar exact path={Routes.DocsBuild.path} component={DocsBuild} />
      <RouteWithSidebar exact path={Routes.DocsChangelog.path} component={DocsChangelog} />

      <Redirect to={Routes.NotFound.path} />
    </Switch>
  )
}
