# Docker command to setup a database

## docker command to run container

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -v mongodb_data:/data/db \
  mongo
```

## then uri becomes

```bash
mongodb://admin:secret@localhost:27017
```

## 👉 And if you’re connecting with a specific database (e.g., mydb):

```bash
mongodb://admin:secret@localhost:27017/mydb?authSource=admin
```

## docker run to go inside the mongo container

```bash
docker exec -it mongodb mongosh -u admin -p secret --authenticationDatabase admin
```
