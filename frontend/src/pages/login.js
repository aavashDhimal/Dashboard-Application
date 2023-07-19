import { EuiFieldText, EuiButton, EuiForm, EuiFormRow } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';
import { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import base_url from '../helpers/constants';

const LoginPage = () => {
  const [error,setError] = useState('')
  const [formData, setFormData] = useState({
    user: '',
    password: '',
  });
 const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleLogin = async (formData) =>{
    console.log("form",formData)
    
};
  
useEffect(()=>{
  localStorage.removeItem("auth_token");
  localStorage.removeItem("dash_user");

},[])

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("beasdas",formData)
    axios.post( base_url + "auth/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(function (response) {
      console.log(response.data.token,"asdasd");
      localStorage.setItem("auth_token", response.data.token);
      localStorage.setItem("dash_user", response.data.user);

      navigate("/dashboard");
    })
    .catch(function (error) {
      console.log("error", error);
      setError("Invalid Username or Password");
    });
  console.log("adsasd")
  };




  return (
    <div className='login-page'>
      <div className='title'>
        <div className='title-nav'>Dashboard</div>
      </div>
      <div className="login-form">
        <h2 style={{margin : "20px"}}>Login To Continue</h2>

        <EuiForm component="form" style={{ width: "100%" }}  >
          <EuiFormRow label="Username" style={{ color: "white" }}>
            <EuiFieldText
              placeholder='Username'
              value={formData.user}
              onChange={handleChange}
              name="user" 
            />
          </EuiFormRow>
          <EuiFormRow label="Password" placeholder='Password'>
            <EuiFieldText
              type="password"
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              name="password" 
            />
          </EuiFormRow>
          <EuiButton type="submit" style={{ textAlign: "center" }} fill onClick={handleSubmit}>Login</EuiButton>
          {error ? (<p style={{color:"red" , fontSize : "15px",margin: "10px" }}>{error}</p>) : ''}
        </EuiForm>
      </div>
    </div>
  );
};

export default LoginPage;
