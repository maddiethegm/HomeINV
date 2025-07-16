## Welcome to HomeINV
This is my first Node.JS development project- I started to get myself a basic understanding of Node.JS, and I feel I've had some success.

Nonetheless, deploy my code at your own risk.

See package.json and client/package.json for startup scripts.

A .sql file is provided in the project root for you to create the necessary tables- just replace YOURDBNAME with the name of your database. 

See below for details on configuring the database parameters.

Happy tinkering!

## Config
### API Server Configuration
#### Save these variables in /.env
The following environment variables are used to configure the application:
> PORT=

    API server listening port.
    Default: 3001
### DB Config
> DB_USER=

    DB username for read/write access
> DB_PASSWORD=

    Password to login as DB_USER
> DB_SERVER=

    DB server URL
    Example: sql.example.tld
    Example: localhost
> DB_DATABASE=

    Your database name
> DB_TYPE=

    Options: mssql, oracle, mariadb, postgres
### JWT Configuration
> JWT_SECRET=

    Example: your_secret_key
> TOKEN_EXPIRY=

    Example: '8h'
    Default: '1h'
### LDAP Config
> LDAP_URL=

    Example: ldap://example.tld
> LDAP_DOMAIN_COMPONENTS=

    Example: 'cn=users,dc=example,dc=tld'
> LDAP_USER_ATTRIBUTE=

    Example: 'cn'
### React App Config
Save these variables client folder - default /client/.env
### API Config
> REACT_APP_API_URL=

    URL to reach your API backend. This is relative to your client, not the frontend server.
    Example: http://homeinv.example.tld/api:3001
### Footer details
> REACT_APP_SUPPORT_CONTACT=
    
    Example: "Me"
    Example: "admin@example.tld"
> REACT_APP_FOOTER_IMG_URL=

    Example: http://example.tld/footer.png