# Assignment_2
Users and authentication (token) are handled with api calls as in the tutorial.

The menu is handled with api calls. Only administrator (hardcoded) can create, update, delete pizzas. Read item does not require authentication. Read menu also does not require authentication.

The shopping cart is token oriented. The cart id is the token. The token's expiration time is extended when shopping activity occurs.

When user procceds to order, the respective api call handles the stripe payment verification providing the (example in our case) purchase token to stripe api. Subsequently calls the mailgun api to send an email to the user/customer. Finaly stores the order to the system.

## API 
### /users
#### post
- **Description :**  Creates a new user
- **Happy-case response :** 200
- **Required payload data :** name, email, address, password
- **Required header data :** none
- **Example payload :** {'name':'Joe Doe', 'email':'joe@doe.com, 'address':'gjgjg 76', 'password':'oooooooo'}

#### get
- **Description :** Returns user's own data
- **Happy-case response :** 200, user data (except password)
- **Required query data :** email
- **Required header data :** token
- **Example use :** localhost:3000/users?email=joe@doe.com
- **Restrictions :** Every user can access only his own data

#### put
- **Description** : Updates user's data
- **Happy-case response** : 200, user data (except password)
- **Required payload data** : email
- **Optional payload data** : At least one of name, address, password
- **Required header data** : token
- **Example payload :** {"name":"John Doe", "email":"joe@doe.com", "password":"nnooiiio"}
- **Restrictions** : Authentication, every user can update only his own data

#### delete
- **Description** : Deletes user's record(file)
- **Happy-case response** : 200
- **Required query data** : email
- **Required header data** : token
- **Example request** : localhost:3000/users?email=joe@doe.com
- **Restrictions** : Authentication, every user can delete only his own record (file)

### /tokens
#### post
- **Description** : Creates a new token
- **Happy-case response** : 200, token object
- **Required payload data** : email, password
- **Required header data** : none
- **Example payload** : {'email':'joe@doe.com, 'password':'nnooiiio'}

#### get
- **Description** : Returns token data
- **Happy-case response** : 200, token object e.g. {"email":"joe@doe.com","id":"1ul3xreihg4gmmg8uxk1","expires":1539295461773}
- **Required query data** : id
- **Required header data** : none
- **Example request** : localhost:3000/tokens?id="tnls7gwmq2zd740pzao5"

#### put
- **Description** : Extends expiration
- **Happy-case response** : 200
- **Required payload data** : id, extend
- **Optional payload data** : none
- **Required header data** : none
- **Example payload** : {"id": "51kw0181psothvlxmlso", "extend": true}

#### delete
- **Description** : Deletes token 
- **Happy-case response** : 200
- **Required query data** : id
- **Required header data** : none
- **Example request** : localhost:3000/tokens?id=51kw0181psothvlxmlso


### /pizzas
#### post
- **Description** : Adds a new pizza file in system
- **Happy-case response** : 200
- **Required payload data** : id, name, ingredients, size, price
- **Required header data** : token
- **Example payload** : {"id":"siciliana_med", "name":"Siciliana", "ingredients": ["Tomato sauce", "mozzarella",  "spicy salami", "onions", "garlic", "oregano"], "size":"medium", "price" : 6.80 }
- **Restrictions** : Only administrator can post a new pizza (hardcoded admin@admin.com)

#### get
- **Description** : Returns pizza details
- **Happy-case response** : 200, pizza object 
- **Required query data** : id 
- **Required header data** : none
- **Example request :** localhost:3000/pizzas?id=gorgonzola_med (returns specific pizza details)
- **Example response :** 
  {
        "id": "gorgonzola_med",
        "name": "Gorgonzola",
        "ingredients": ["Tomato sauce", "mozzarella", "gorgonzola", "oregano" ],
        "size": "medium",
        "price": 7.8
    }

#### put
- **Description** : Changes pizza's attributes
- **Happy-case response** : 200
- **Required payload data** : id
- **Optional payload data** : At least one of name, ingredients, size, price
- **Required header data** : token
- **Example payload** : {"id":"pugliese_med", "price" : 6.40}
- **Restrictions** : Only administrator can update a pizza (hardcoded admin@admin.com)

#### delete
- **Description** : Deletes pizza 
- **Happy-case response** : 200
- **Required query data** : id
- **Required header data** : token
- **Example request** : localhost:3000/pizzas?id=gorgonzola_med
- **Restrictions** : Only administrator can delete a pizza (hardcoded admin@admin.com)


### /menu
#### get
- **Description** : Returns menu. The menu is generated from the pizza files saved to the system
- **Happy-case response** : 200, pizzas array
- **Required query data** : none
- **Required header data** : none
- **Example request :** localhost:3000/menu 
- **Example response :** 
[
    {
        "id": "gorgonzola_med",
        "name": "Gorgonzola",
        "ingredients": ["Tomato sauce", "mozzarella", "gorgonzola", "oregano" ],
        "size": "medium",
        "price": 7.8
    },

    ...

    {
        "id": "mushroom_sma",
        "name": "Mushroom",
        "ingredients": ["Tomato sauce", "mozzarella", "mushrooms", "oregano" ],
        "size": "small",
        "price": 5
    }
]

### /carts

#### post
- **Description** : Add a new item in shopping cart. If cart does not exist, create one with id the token id.
- **Happy-case response** : 200
- **Required payload data** : id, quantity
- **Required header data** : token
- **Example payload** : {"id":"marinara_med","quantity" : 1}

#### get
- **Description** : Returns shopping cart details
- **Happy-case response** : 200, cart details
- **Required query data** : none
- **Required header data** : id
- **Example request** : localhost:3000/carts
- **Example response** : 
{
    "cart": [
        {
            "id": "margherita_big",
            "name": "Margherita",
            "ingredients": ["Tomato sauce", "mozzarella", "oregano"],
            "size": "big",
            "price": 9.5,
            "quantity": 2,
            "subtotal": 19
        },
        {
            "id": "marinara_med",
            "name": "Marinara",
            "ingredients": ["Tomato sauce", "garlic", "oregano"],
            "size": "big",
            "price": 5,
            "quantity": 3,
            "subtotal": 15
        }
    ],
    "total": 34
}

#### put
- **Description** : Changes item's quantity
- **Happy-case response** : 200, cart contents
- **Required payload data** : id, quantity
- **Optional payload data** : none
- **Required header data** : token
- **Example payload** : {"id":"margherita_big", "quantity" : 2}
- **Example response** : 
[ 
    {
        "id": "margherita_big", 
        "quantity": 2
    },
    {
        "id": "marinara_med", 
        "quantity": 3
    } 
]

#### delete
- **Description** : Deletes item from cart 
- **Happy-case response** : 200, cart contents (after the deletion)
- **Required query data** : id
- **Required header data** : token
- **Example request** : localhost:3000/carts?id=marinara_med
- **Example response** : 
[ 
    {
        "id": "margherita_big", 
        "quantity": 2
    } 
]


### /order

#### post
- **Description** : Order the cart contents. Accept payment with stripe and acknowledge with mailgun.
- **Happy-case response** : 200, message
- **Required payload data** : none
- **Optional payload data** : none
- **Required header data** : token

