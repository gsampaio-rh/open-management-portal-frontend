import React from "react";
import {
  Button, 
  EmptyStateIcon,
  Form,
  FormSelect,
  FormSelectOption,
  InputGroup,
  Text,
  TextInput, 
} from "@patternfly/react-core";

import { PlusCircleIcon, ErrorCircleOIcon, CubesIcon } from '@patternfly/react-icons';

const selectStyle = {
  width: '24%'
}

const listHeader = {
  width: '24%',
  fontWeight: 'bold',
}

const buttonHeader = {
  width: '4%',
  fontWeight: 'bold'
}

const ClusterUsers = ({ options, values, onChange }) => {
  //Functions for Cluster User interactivity
  function addUser(){
    const newUser = {first_name: '', last_name: '', email: '', role: ''};
    values.engagement_users.push(newUser);
    onChange({ type: "user", payload: values.engagement_users });
  }

  function removeUser(index){
    values.engagement_users.splice(index.currentTarget.value, 1);
    onChange({ type: "user", payload: values.engagement_users })
  }
  
  return (
    <div className="pf-c-empty-state">
      {!values.engagement_users.length ? (
          <div>
            <div 
              style={{ fontSize: "3rem" }}
            >
              <div>
                <EmptyStateIcon icon={CubesIcon} />
              </div>
              No Users Added
            </div>
            <div>
              <p>No users have been added to this engagement's yet.</p>
              <p>Select the 'add user' button below, to begin adding users.</p>
            </div>
          </div>
        ) : (
          <div 
            style={{ fontSize: "2rem" }}
          >
            Roster
            <Form isHorizontal>
              <ul>
                <li>
                  <InputGroup>
                    <Text style={listHeader}>Last Name</Text>
                    <Text style={listHeader}>First Name</Text>
                    <Text style={listHeader}>email</Text>
                    <Text style={listHeader}>Role</Text>
                    <Text style={buttonHeader}>Del</Text>
                  </InputGroup>
                </li>
                {values.engagement_users.map((value, index) => {
                  return <li key={index}>
                    <InputGroup>
                      <TextInput
                        aria-label="Last Name"
                        name="last-name"
                        onChange={e => {
                          values.engagement_users[index].last_name = e;
                          onChange({ type: "user", payload: values.engagement_users });
                        }}
                        placeholder="Last Name"
                        type="text"
                        value={value.last_name || ''}
                      />
                      <TextInput
                        aria-label="First Name"
                        name="first-name"
                        helper="first name"
                        onChange={e => {
                          values.engagement_users[index].first_name = e;
                          onChange({ type: "user", payload: values.engagement_users });
                        }}
                        placeholder="First Name"
                        type="text"
                        value={value.first_name || ''}
                      />
                      <TextInput
                        aria-label="email"
                        name="email"
                        onChange={e => {
                          values.engagement_users[index].email = e;
                          onChange({ type: "user", payload: values.engagement_users });
                        }}
                        placeholder="Email Address"
                        type="email"
                        value={value.email || ''}
                      />
                      <FormSelect
                        style={selectStyle}
                        name="role"
                        aria-label="User Role"
                        value={value.role || ''}
                        onChange={e => {
                          values.engagement_users[index].role = e;
                          onChange({ type: "user", payload: values.engagement_users });
                        }}
                      >
                        {options["user-management"].rbac.roles.map((option, index) => (
                          <FormSelectOption
                            isDisabled={option.disabled}
                            key={index}
                            value={option.value}
                            label={option.label}
                          />
                        ))}
                      </FormSelect>
                      <Button onClick={removeUser} value={index} variant="danger" isInline>
                        <ErrorCircleOIcon />
                      </Button>
                    </InputGroup> 
                  </li>
                })}
              </ul>
            </Form>
          </div>
        )}
        <Button onClick={addUser} variant="link" icon={<PlusCircleIcon />}>
          Add User
        </Button>
    </div>
  );
};

export default ClusterUsers;
