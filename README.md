# GraphQL Federation Demo

This repository is an example of using Apollo Federation to build a single schema on top of multiple services.

The microservices are located under the `./services` folder and the gateway that composes the overall schema is in the gateway.js file.

## Run the install command

```
npm i
```

### Start in dev mode

```
npm run dev
```
**Please note:** Should be running on http://localhost:4000


### Test query

```
{
  posts {
    title
    body
    postedBy {
      name
      email
    }
    comments {
      body
      postedBy {
        name
        email
      }
    }
  }
}
```



