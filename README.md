# equity-data-tool

Repo for Urban's [Spatial Equity Data Tool](https://apps.urban.org/features/equity-data-tool/index.html)

To run locally, replace the file `env.js.template` with an `env.js` file using the same structure. Then simply run a local server from the root directory, there are no further build steps required.

If a `403 error` is ever raised while trying to upload a file on the stg site,
A new token might need to be generated. This can be done by accessing the server
via ssh, navigate through `var/www/apps.urban.org/features/equity-data-tool`, 
open the `env.js` file, & copy the token value. Next, use a REST Client tool
like Postman or Insomnia, create a post request on that url `https://equity-tool-api-stg.urban.org/api-token-auth/`, and pass this JSON payload:
`{
    "username": "theusername",
    "password": "thepassword",
    "TOKEN": "thetokenyoucopiedfromtheserver"
}`
Once that POST request is sent (make sure the right credentials were implemented),it will generate a new token. Copy the new-generated token, go back on the server, delete the old value the token had and replace it by the new one. Save the filen then restart your server.