import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../Firebase";


class Login extends Component {

  state = {
    email: "",
    password: "",
    errors: [],
    loading:false
  };


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };




  handleSubmit = (e) => {
    e.preventDefault();
    if(this.isFormValid(this.state)){
        this.setState({
            errors:[],
            loading:true
        })

        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
        .then((signedInUser)=>{
            console.log(signedInUser);
            this.setState({
                errors:[],
                loading:false
            })
        })
        .catch((err)=>{
            console.log(err);
            this.setState({
                errors:this.state.errors.concat(err),
                loading:false
            })
            
        })
    }
  };

  isFormValid=({email,password})=>{
      return email && password
  }


  handleInputError=(errors,inputName)=>{
    return errors.some((error)=> error.message.toLowerCase().includes(inputName)) ? 'error':''
  }



  render() {
    const {
      email,
      password,
      errors,
      loading
    } = this.state;

    return (

      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login to DevChat
          </Header>

          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>

              <Form.Input
                type="email"
                className={this.handleInputError(errors,'email')}
                fluid
                name="email"
                value={email}
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
              />

              <Form.Input
                type="password"
                className={this.handleInputError(errors,'password')}
                fluid
                name="password"
                value={password}
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
              />

              <Button disabled={loading} className={loading ? 'loading' :""} color="violet" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>

          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {errors.map((err, i) => {
                return <p key={i}>{err.message}</p>;
              })}
            </Message>
          )}

          <Message>
            Don't have an account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}


export default Login;

