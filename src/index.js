import React,{Fragment,useEffect} from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css'
import {BrowserRouter as Router,Switch,Route,withRouter} from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './Firebase';
import {Provider,connect} from 'react-redux';
import store from './store';
import {setUser,clearUser} from './actions/User';
import Spinner from './Spinner';


function Root({history,setUser,isLoading,clearUser}) {

  useEffect(()=>{
    
    firebase.auth().onAuthStateChanged((user)=>{
      if (user) {
        history.push('/');
        setUser(user)
      }
      else{
        history.push('/login');
        clearUser();
      }
    })

  },[history])

  return (
    <Fragment>
      {isLoading ? <Spinner/> : ( 
        <Switch>
          <Route path="/" exact component={App}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
        </Switch>
      )}
    </Fragment>
  );
}


const mapStateToProps=(state)=>{
  return{
    isLoading:state.user.isLoading
  }
}

const AppwithAuth=withRouter(connect(mapStateToProps,{setUser,clearUser})(Root));


ReactDOM.render(
  <Provider store={store}>
  <Router>
    <AppwithAuth />
  </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
