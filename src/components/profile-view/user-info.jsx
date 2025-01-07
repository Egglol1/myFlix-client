import React from 'react';

export const UserInfo = ({email, Username, password, birthday}) => {
    return(
        <>
          <h3>User Info</h3>
          <p>User: {Username}</p>
          <p>Password: {password}</p>
          <p>Email: {email}</p>
          <p>Birthday: {birthday}</p>
        </>
    )
}