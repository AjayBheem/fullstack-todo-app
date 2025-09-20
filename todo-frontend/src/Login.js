import { Component } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import { Navigate } from "react-router-dom";
import "./Login.css";

class Login extends Component {
  state = { username: "", password: "", errMsg: "" };

  onChangeusername = (event) => {
    this.setState({ username: event.target.value });
  };

  onChangepassword = (event) => {
    this.setState({ password: event.target.value });
  };

  renderUsername = () => {
    const { username } = this.state;
    return (
      <>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          type="text"
          onChange={this.onChangeusername}
          required
        />
      </>
    );
  };

  renderPassword = () => {
    const { password } = this.state;
    return (
      <>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          value={password}
          type="password"
          onChange={this.onChangepassword}
          required
        />
      </>
    );
  };

  onSubmitSuccess = (jwtToken,username) => {
    Cookies.set("jwt_token",jwtToken,{expires: 30});
    Cookies.set("username",username,{expires: 30})
    const { navigate } = this.props;
    navigate("/home", { replace: true });
  };

  submitForm = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    try {
      const response = await fetch("http://localhost:4000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        this.onSubmitSuccess(data.token,username);
      } else {
        this.setState({ errMsg: data.message });
      }
    } catch (error) {
      this.setState({ errMsg: "Network error. Try again." });
    }
  };

  render() {
    const jwtToken=Cookies.get("jwt_token");
    if(jwtToken!==undefined){
        return <Navigate to="/home" replace/>
    }
    return (
      <div className="login-page">
            <div className="login-card">
                <h2>Login</h2>
                <form onSubmit={this.submitForm}>
                <div>{this.renderUsername()}</div>
                <div>{this.renderPassword()}</div>
                {this.state.errMsg && (
                    <p className="error-msg">{this.state.errMsg}</p>
                )}
                <button type="submit">Login</button>
                </form>
            </div>
     </div>
    
    );
  }
}

function LoginWithNavigate(props) {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
}

export default LoginWithNavigate;
