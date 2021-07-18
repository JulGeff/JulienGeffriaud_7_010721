import loginpic from "../../assets/login-image.png";
import '../../styles/LoginSignup.css'
import React from "react";
import Api from '../Api'

function Signup() {
    const [lastName, setLastName] = React.useState(""); //initialisation du state vide
    const [firstName, setFirstName] = React.useState(""); //initialisation du state vide
    const [email, setEmail] = React.useState(""); //initialisation du state vide
    const [password, setPassword] = React.useState(""); //initialisation du state vide
  
    const handleSubmit = (event) => {
        event.preventDefault();

        if ((/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email)) //regex : email au format example@test.test
        && (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password))) { //regex : le mot de passe doit contenir au moins 8 caractères, 1 lettre, 1 chiffre et 1 caractère spécial

            
            let signupFormData = { 
                lastName : lastName, 
                firstName : firstName, 
                email : email, 
                password: password
            };

            console.log(signupFormData);

            Api.post('/auth/signup', signupFormData) //requête POST via Axios

                .then(function (response) {  //Si Ok
                console.log(response);
                })
                .catch(function (response) { // Si erreur
                console.log(response);
                });

        } else { // si email et mdp ne respecent pas les regex définies
                alert("- Votre email doit être au format example@test.test\n- Votre mot de passe doit contenir au moins 8 caractères, 1 lettre, 1 chiffre et 1 caractère spécial @$!%*#?&");
        }}



    return (
        <div className='loginsignup'> 
        <img src={loginpic} alt='Groupomania' className='loginpic' />
        <h1>Créez un compte</h1>
        <form id ='signupForm' className="logform" onSubmit={handleSubmit}>
       
                <input  id='firstName' 
                        className="input" 
                        type="string" 
                        name="firstName" 
                        placeholder="Prénom" 
                        maxLength="40" 
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)} 
                        required 
                />

                <input  id='lastName' 
                        className="input" 
                        type="string" 
                        name="lastName" 
                        placeholder="Nom" 
                        maxLength="40" 
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)} 
                        required
                />

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
                        value="Je crée mon compte" 
                />
        </form>

        <p>Vous avez déjà un compte ?</p>
        <p>Connectez-vous</p>
    </div>
    );
  }
  
export default Signup




