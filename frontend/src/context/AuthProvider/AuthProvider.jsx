import React from 'react';
import Authcontext from './AuthContext';

const AuthProvider = ({children}) => {
    const [dashUserState, setDashUserState] = React.useState(false);
    const [dashUser, setDashUser] = React.useState(false);
    return (
        <Authcontext.Provider value={{
            dashUserState, setDashUserState,
            dashUser, setDashUser
        }}>
            {children}
        </Authcontext.Provider>
    );
}

export default AuthProvider;
