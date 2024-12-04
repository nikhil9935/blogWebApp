import React, { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Button, Form, Grid, Segment, Header, Message } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { LOGIN_USER } from "../utils/graphqlQueries";
import { useForm } from "../utils/hooks";

function Login() {
  const [error, setError] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { formData, onChange, onSubmit } = useForm(
    {
      username: '',
      password: ''
    },
    loginCallBack
  );

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(proxy, { data: { login: userData } }) {
      login(userData);
      navigate('/');
    },
    onError(err) {
      setError(err?.graphQLErrors[0]?.extensions?.errors);
    },
    variables: formData
  });

  function loginCallBack() {
    return loginUser();
  }

  return (
    <Grid
      centered
      style={{ height: "100vh", margin: 0 }}
    >
      <Grid.Column style={{ maxWidth: 450 }}>
        <Segment padded="very" raised>
          <Header as="h2" textAlign="center" style={{ marginBottom: "1.5rem" }}>
            Login to your account
          </Header>
          <Form onSubmit={onSubmit} loading={loading}>
            <Form.Input
              label="Username"
              placeholder="Username"
              name="username"
              type="text"
              error={!!error?.username}
              value={formData?.username}
              onChange={onChange}
            />
            <Form.Input
              label="Password"
              placeholder="Password"
              name="password"
              type="password"
              error={!!error?.password}
              value={formData?.password}
              onChange={onChange}
            />
            <Button type="submit" primary fluid>
              Login
            </Button>
          </Form>

          {error && !!Object.keys(error)?.length && (
            <Message
              error
              header="Login Error"
              list={Object.values(error)}
              style={{ marginTop: "1.5rem" }}
            />
          )}
        </Segment>
      </Grid.Column>
    </Grid>
  );
}

export default Login;
