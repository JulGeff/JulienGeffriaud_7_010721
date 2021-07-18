
import loginpic from "../../assets/login-image.png";
import '../../styles/LoginSignup.css'
import React from "react";
import Api from '../Api'


function Login() {
    const [email, setEmail] = React.useState(""); //initialisation du state vide
    const [password, setPassword] = React.useState(""); //initialisation du state vide
  
    const handleSubmit = (event) => {
        event.preventDefault();

        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) { 

            
            let loginFormData = { 
                email : email, 
                password: password
            };

            console.log(loginFormData);

            Api.post('/auth/signup', loginFormData) //requête POST via Axios

                .then(function (response) {  //Si Ok
                console.log(response);
                })
                .catch(function (response) { // Si erreur
                console.log(response);
                });

        } else { // si email ne respecte pas les regex définies
                alert("- Votre email n'est pas au bon format")
        }}

    return (
        
        <div className='loginsignup'>
            
        <img src={loginpic} alt='Groupomania' className='loginpic' />
        <h1>Connectez-vous</h1>
        <form id ='loginForm' className="logform" onSubmit={handleSubmit}>
                
                <input  id='email' 
                        className="input" 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        maxLength="40"
                        autoComplete="username" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        required 
                />

                <input  id='password' 
                        className="input" 
                        type="password" 
                        name="password" 
                        maxLength="40"
                        autoComplete="current-password"
                        placeholder="Choisissez un mot de passe" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
                />

                <input  className="button" 
                        type="submit" 
                        value="Je me connecte" 
                />
        </form>

        <p>C'est votre première visite ?</p>
        <p>Créez un compte</p>
    </div>
    );
  }
  
export default Login
