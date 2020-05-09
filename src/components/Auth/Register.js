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
import md5 from 'md5';


class Register extends Component {

  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading:false,
    usersRef:firebase.database().ref('users')
  };


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };



  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      error = { message: "Fill in all the fields!" };
      this.setState({
        errors: errors.concat(error),
      });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: "Password is invalid!" };
      this.setState({
        errors: errors.concat(error),
      });
      return false;
    } else {
      return true;
    }
  };



  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };


  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };


  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
        this.setState({
            errors:[],
            loading:true
        })
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          
          createdUser.user.updateProfile({
              displayName:this.state.username,
              photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?=identicon`
          })
          .then(()=>{

            this.saveUser(createdUser).then(()=>{
                console.log('User Saved!');
                this.setState({
                    errors:[],
                    loading:false
                })
                
            })

          })
          .catch((err)=>{
              console.error(err);
              this.setState({
                  errors:this.state.errors.concat(err),
                  loading:false
              })
          })

        })
        .catch((err) => {
          console.log(err);
          this.setState({
              errors:this.state.errors.concat(err),loading:false
            })
        });
    }
  };

  handleInputError=(errors,inputName)=>{
    return errors.some((error)=> error.message.toLowerCase().includes(inputName)) ? 'error':''
  }


  saveUser=(createdUser)=>{
      return this.state.usersRef.child(createdUser.user.uid).set({
          name:createdUser.user.displayName,
          avatar:createdUser.user.photoURL
      })
  }


  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (

      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>

          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                type="text"
                className={this.handleInputError(errors,'username')}
                fluid
                name="username"
                value={username}
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
              />

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

              <Form.Input
                type="password"
                className={this.handleInputError(errors,'password')}
                fluid
                name="passwordConfirmation"
                value={passwordConfirmation}
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
              />

              <Button disabled={loading} className={loading ? 'loading' :""} color="orange" fluid size="large">
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
            Already a user ? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}


export default Register;
