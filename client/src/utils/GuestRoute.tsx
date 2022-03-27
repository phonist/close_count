import React from 'react'
import {
    Route,
    RouteProps,
    Navigate
} from 'react-router-dom'
//redux stuff
// import {
//     connect
// } from 'react-redux'
// interface MyRouteProps extends RouteProps {
//     element: any;
//     authenticated: boolean;
//     rest ? : any
// }
// const GuestRoute: React.SFC<MyRouteProps> = ({
//     element: Element,
//     authenticated,
//     ...rest
// }: any) => ( <Route {...rest} render={ (props:any) => authenticated ? <Navigate to = '/' /> : <Element {...props}/> } /> );

// const mapStateToProps = (state: any) => ({
//     authenticated: state.user.authenticated
// });

const GuestRoute = ({ 
    children,
    authenticated,
}: any) => {
    return authenticated ? <Navigate to = '/' /> : children
}

export default GuestRoute;

// export default connect(mapStateToProps)(GuestRoute)