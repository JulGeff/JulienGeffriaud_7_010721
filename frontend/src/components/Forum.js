
import React, { useEffect, useState} from 'react';
import Api from './Api'
import '../styles/style.css'
import { Redirect, Link } from 'react-router-dom';


function Forum({loggedIn}) {

    const [forum, setForum] = useState([]); //initialisation du state vide   
    const [title, setTitle] = useState(""); //initialisation du state vide
    const [content, setContent] = useState(""); //initialisation du state vide
    let userId = localStorage.getItem("id") 
    console.log(userId)
    let token = localStorage.getItem('token')

     // RECUPERATION DES PUBLICATIONS STOCKEES DANS LA BDD

    useEffect(() => {
      
      let token = localStorage.getItem('token')
     
        Api.get('/publication', 
        {   headers: {
          'Authorization': `${token}` // On sécurise la requête en incluant le token dans les headers (cf middleware "auth")
        }}) //requête GET via Axios
        .then(function (response)  {
            const forum = response.data;
            setForum(forum);
            console.log(forum);
          })
          .catch(function (response) { // Si erreur
            console.log("pb frontend", response.data);
            });
            }
      , [])


      const handleDelete = (e, id) => { //Quand on clique sur "Supprimer ma publication"
        e.preventDefault();

        Api.delete('/publication', {                  
          headers: {
              'Authorization': `${token}` //On sécurise la requête avec le token
          },
          params: { // On envoie l'id de la publication dans les paramètres de la requête
            id : id
           },
        }) 
   
        .then(function (response) {
          console.log("Publication supprimée", response)  
         
    
        })
        .catch(function (response) { // Si erreur
        console.log("Erreur", response);
       
        });
        }

      if (!loggedIn) {
        return <Redirect to="/"/>
        }

        // PUBLICATION DES ARTICLES
        const handleSubmit = (event) => {  // Au clic sur le bouton "Publier !"
          event.preventDefault();
          let token = localStorage.getItem('token')
         
         if(title === null || title === '' || content === null || content === '') {  // On vérifie que les champs
                 return event.status(400).json({'error': "Veuillez remplir les champs 'titre' et 'contenu' pour créer un article"});
    
          } else {
            
                 
              let publicationData = { 
                  title : title,
                  content : content,
              };
    
              console.log(publicationData);
    
              Api.post(
                  '/publication', publicationData,
                  {headers: {
                    'Authorization': `${token}` // On sécurise la requête en incluant le token dans les headers (cf middleware "auth")
                  }}
             ) //requête POST via Axios
    
                  .then(function (response) {  //Si Ok
                  console.log(response);
                  //setForum(forum.push(publicationData));
                  setTitle('');
                  setContent('');
                  alert("Votre publication a bien été postée !")
                  })
                  .catch(function (response) { // Si erreur
                  console.log("pb frontend", response.data);
                  });
    
          }
    }


    return (
      <div className='forum'> 
        <div className = "forum__createpost">
          <h1>Partagez vos pensées avec vos collègues !</h1>
          <form onSubmit={handleSubmit} >
        
                  <input  id='title' 
                          className="input" 
                          type="string" 
                          name="title" 
                          placeholder="Titre" 
                          minLength="2"
                          maxLength="50" 
                          value={title} 
                          onChange={e => setTitle(e.target.value)} 
                          required 
                  />

                  <textarea  
                          id='content' 
                          className="input" 
                          type="string" 
                          name="content" 
                          placeholder="Rédigez votre publication ici" 
                          minLength="2"
                          maxLength="500" 
                          rows={10}
                          cols={5}
                          value={content} 
                          onChange={e => setContent(e.target.value)} 
                          required
                  />


                  <input  className="button" 
                          type="submit" 
                          value="Publier !" 
                  />
          </form>
        </div>



        <div className = "forum__displayposts">  
              
              <h1>Publications les plus récentes</h1>

               {forum.length? ( // Si array des publications non vide
                  <div >
                    {forum.map((item,i) => 
                   
                    <div key={i}>
                        <Link to={"./forum/publication?id=" + item.id}  className = "forum__displayposts__link">
                            <div className = "forum__displayposts__link__content">
                                <h2>{item.title}</h2>
                                <p className='forum__displayposts__link__content__subtitle'> Publié par <strong>{item.userId}</strong> le {item.createdAt.substring(9,10).padStart(2, '0')}/{item.createdAt.substring(6,7).padStart(2, '0')}/{item.createdAt.substring(0,4)} à {item.createdAt.substring(11,16)}   </p>
                                <p>{item.content}</p>
                            </div>
                        </Link>
                       
                        {item.userId===userId 
                        ? (
                        <div><p className = "userpublications__display__link__content__delete" onClick = {e => handleDelete(e, item.id)} >Supprimer ma publication</p></div>) 
                        : ('')}

                        </div>   
                        )}  
                  </div>   
                 ) : ( // Si array des publications vide
                    <p>Il n'y a pas publications. Rédigez le premier article du forum !</p>
                )} 
        </div>
  </div>
        
    );
  };
  
export default Forum


