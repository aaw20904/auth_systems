/**
Firstly, go to the facebook console:
  https://developers.facebook.com/apps/?show_reminder=true
after this, push the button "<< create app >>"
choose "<< Set up Facebook log in >>" and << Next...>>
choose << Website >> and << No, I'm not building a game >>  and "Next.."
enter "Add an app name" - the name of your app.
Push "Create app.."
***
After this you have been redirected to the "Dashboard"
In the dashboard push "Products" (on the left - ignition lamp icon)
Push a dropdown -"Configure->Settings"
Enter "Valid OAuth Redirect URIs" - for example https://localhost/users/fb"
Enter an another extra params - if it`s necessary.
Push "Settings->Basic" on the left side.
Get appID and the secret.


/*In the app:
1)Send to the FB server a GET request with URI parameters (clientID and redirect URL);
2)Receive a response with code;
3)Sending GETrequest with URI params = clientID, client_secret 
4)receive an access token
5)Sending request to FaceBook Graph API - to retrive user name and photo  

*/
https://medium.com/@jackrobertscott/facebook-auth-with-node-js-c4bb90d03fc0
*/
