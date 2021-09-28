import React from "react";
import { Redirect } from "react-router-dom";





// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";

//Organization
import Organization from "../pages/organization";
import Users from "../pages/users";
import Roles from "../pages/roles";
import Workspace from "../pages/workspace";
import AwsKeys from "../pages/awsKeys";




import Diagram  from "../pages/diagram";
// import Diagram  from "../container/gojs/index";
// import Diagram  from "../container/gojs";
import CodeEditor from "../container/codeEditor";




const authProtectedRoutes = [


	//
	{ path: "/organization", component: Organization },
	{ path: "/users", component: Users },
	{ path: "/roles", component: Roles },
	{ path: "/workspace", component: Workspace },
	{ path: "/keys", component: AwsKeys },

	

	{ path: "/code", component: CodeEditor },

	{ path: "/canvas/:id", component:Diagram},

	
	{ path: "/", exact: true, component: () => <Redirect to="/organization" /> }
];

const publicRoutes = [
	{ path: "/logout", component: Logout },
	{ path: "/login", component: Login }
];

export { authProtectedRoutes, publicRoutes };
