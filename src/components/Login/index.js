import React from "react";
import { connect } from "react-redux";

import { login } from "../../actions/Auth";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "rajeev",
      password: "goc"
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit() {
    const { userName, password } = this.state;
    this.props.dispatch(login({ userName, password }));
  }
  render() {
    return (
      <div>
        <h1>Login</h1>
        <div>
          <input type="text" />
          <input type="text" />
        </div>
        <div>
          <button onClick={this.onFormSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  console.log("State", state);
})(Login);

// function Login() {
//   return (
//     <div>
//       <h1>Login</h1>
//       <div>
//         <input type="text" />
//         <input type="text" />
//       </div>
//       <div>
//         <button>Submit</button>
//       </div>
//     </div>
//   );
// }
