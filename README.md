# oncall-api-demo

Based on https://github.com/fraigo/node-express-rest-api-example

This provides an API endpoint for creating/reading/updating/deleting on-call engineers to provide a simple example of integration.

# API Endpoints

## GET /api/users

Get a list of users

```json
{
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "admin",
      "email": "admin@stackpule.com",
      "tenant": "stackpulse"
    },
    {
      "id": 2,
      "name": "bob",
      "email": "bob@neilcar.com",
      "password": "neilcar"
    }
  ]
}
```

## GET /api/user/{tenant}

Get user information by user id

```json
{
  "message": "success",
  "data": {
    "id": 1,
    "name": "admin",
    "email": "admin@stackpule.com",
    "tenant": "stackpulse"
  }
}
```

## POST /api/user/

To create a new user based on POST data (x-www-form-url-encoded)

* name: User name
* email: User email
* tenant: User's tenant


## PATCH /api/user/{id}

To update user data by id, based on POST data (x-www-form-url-encoded)

* name: User name
* email: User email
* tenant: User's tenant

You can send only one attribute to update, the rest of the info remains the same. 

In this example, using CURL you can update the user email:

```bash
curl -X PATCH -d "email=user@example1.com" http://localhost:8000/api/user/2
```

## DELETE /api/user/{id}

To remove a user from the database by user id. 

This example is using the `curl` command line


```bash
curl -X "DELETE" http://localhost:8000/api/user/2
```

The result is:

`{"message":"deleted","rows":1}`











