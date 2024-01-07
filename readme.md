# Learning Prisma

This is a sample project to learn Prisma ORM.

## Setup

- Setup database, worked with SQL
- Install Prisma

```bash
yarn add prisma @prisma/client
```

- Connect prima to database with database URL in .env file

  > DATABASE_URL=mysql://root:password@localhost:3306/name_of_database

- Create a Schema
- Generate Prisma Client

```bash
npx prisma generate
```

- Create a migration (repeat this step when you change the schema)

```bash
npx prisma migrate dev --name init
```

- Deploy the migration (repeat this step when you change the schema)

```bash
npx prisma migrate deploy
```

## Writing Schema

- Create a schema.prisma file

```js
datasource db {
generator client {
    provider = "prisma-client-js"
}
```

- Connect to database

```js
datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
}
```

- Define a model

```js
model User {
    id        Int      @id @default(autoincrement()) // primary key can also use uuid(built in) or custom Id
    email     String   @unique // unique
    firstName String
    lastName      String? // nullable
    age       Int
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

- Define a relation

```js
model House {
    id        String   @id @default(uuid())
    address   String   @unique
    owner     User     @relation("HouseOwner", fields: [ownerId], references: [id]) // Relation fields must be specified for to-one relations and add label to differentiatate the two references to the User model
    ownerId   String // You don't pass the user objecty when creating a house, you pass the user id and Prisma will automatically create the relation
    builtBy   User     @relation("HouseBuiltBy", fields: [builtById], references: [id])
    builtById String // You don't pass the user objecty when creating a house, you pass the user id and Prisma will automatically create the relation
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

```

The updated User model after relation

```js
model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    firstName String
    lastName?  String
    age       Int
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    houses    House[]  @relation("HouseOwner")
    houses    House[]  @relation("HouseBuiltBy")
}
```

## CRUD Operations

- Create

```js
const user = await prisma.user.create({ data: reqBody })
```

- Read

```js
const user = await prisma.user.findUnique({ where: { id: userId } })
const users = await prisma.user.findMany()
// with relation
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    include: {
      owner: true,
      builtBy: true
    }
  }
})
```

- Update

```js
const user = await prisma.user.update({ where: { id: userId }, data: reqBody })
```

- Delete

```js
const user = await prisma.user.delete({ where: { id: userId } })
```

## Filtering

- Filtering by field

```js
const users = await prisma.user.findMany({
  where: {
    firstName: 'Alice'
  }
})
```

- Filtering by relation

```js
const users = await prisma.user.findMany({
  where: {
    owner: {
      age: {
        gte: 18
      }
    }
  }
})
```

> In summary It's a pretty cool ORM and I'm looking forward to using it in my next project.
