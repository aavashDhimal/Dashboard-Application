import { EuiFieldText, EuiButton, EuiForm, EuiFormRow } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_light.css';

const LoginPage = () => {

    const handleFormSubmit = ( e) =>{
        e.preventDefault();
        console.log("event",e.target.data)

    }
  return (
    <div className='login-page'>
        <div className='title'>
    <h1>Dashboard Application</h1>
    <h3>View Your Logs </h3>
    </div>
    <h2>Login</h2>
      <div className="login-form">
      
       
        <EuiForm component="form" style={{width:"100%"}} onSubmit={handleFormSubmit} >
          <EuiFormRow label="Username"  style={{color: "white"}}>
            <EuiFieldText placeholder='Username'/>
          </EuiFormRow>
          <EuiFormRow label="Password" placeholder='Password'>
            <EuiFieldText type="password" placeholder='Pasword' />
          </EuiFormRow >
          <EuiButton  type= "submit" style={{textAlign:"center"}} fill>Login</EuiButton>
        </EuiForm>
      </div>
      </div>
  );
};

export default LoginPage;
