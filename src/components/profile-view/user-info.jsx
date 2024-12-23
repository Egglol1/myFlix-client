import React from 'react';

export const UserInfo = ({email, username, password, birthday}) => {
    return(
        <>
          <h3>User Info</h3>
          <p>User: {username}</p>
          <p>Password: {password}</p>
          <p>Email: {email}</p>
          <p>Birthday: {birthday}</p>
        </>
    )
}