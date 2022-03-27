import React from 'react'
import {
    Route,
    RouteProps,
    Navigate
} from 'react-router-dom'
//redux stuff
import {
    connect
} from 'react-redux'
interface MyRouteProps extends RouteProps {
    component: any;
    authenticated: boolean;
    rest ? : any
}
const GuestRoute: React.SFC <MyRouteProps >= ({
    component: Component,
    authenticated,
    ...rest
}: any) => ( <Route {...rest} render={ (props:any) => authenticated ? <Navigate to = '/' /> : <Component {...props}/> } /> );

const mapStateToProps = (state: any) => ({
    authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(GuestRoute)