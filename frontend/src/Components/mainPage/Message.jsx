import React from 'react';
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import routes from '../../routes';
import { removeMessage } from '../../slices/messagesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/authSlice';
import axios from 'axios';

const removeMessageRequest = (dispatch, token, id) => {
  axios.delete(routes.messagePath(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  dispatch(removeMessage(id));
};

export default ({ username, body, id }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  console.log(username)
  const dropdown = (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
        </svg>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={removeMessageRequest(dispatch, currentUser.token, id)}>Удалить</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Изменить</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <div className="d-flex justify-content-between align-items-center text-break mb-2">
      <div>
        <b>{username}</b>: {body}
      </div>
      <OverlayTrigger placement="left" overlay={dropdown}>
        <span className="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
          </svg>
        </span>
      </OverlayTrigger>
    </div>
  );
};