import React from 'react'

import {
    Route,
    Navigate,
    RouteProps
} from 'react-router-dom'

// import {
//     connect
// } from 'react-redux'

// interface MyRouteProps extends RouteProps {
//     element: any;
//     authenticated: boolean;
//     rest ? : any
// }
// const PrivateRoute: React.SFC<MyRouteProps> = ({
//     element: Element,
//     authenticated,
//     ...rest
// }: any) => ( <Route {...rest} render={ (props:any) => authenticated ? <Element {...props}/> : <Navigate to = '/login' />} /> );

// const mapStateToProps = (state: any) => ({
//     authenticated: state.user.authenticated
// });

// export default connect(mapStateToProps)(PrivateRoute)
const PrivateRoute = ({ 
    children,
    authenticated,
}: any) => {
    return authenticated ? children : <Navigate to = '/login' />
}

export default PrivateRoute