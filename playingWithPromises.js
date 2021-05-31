const got = require('got');

const usersURL = 'https://jsonplaceholder.typicode.com/users'
const todosURL = 'https://jsonplaceholder.typicode.com/todos'
const postsURL = 'https://jsonplaceholder.typicode.com/posts'

const getUsers = async () => got(usersURL).json()

const getUsersById = async (id) => got(usersURL + '/' + id).json()

const getTodos = async () => got(todosURL).json()

const getPosts = async () => got(postsURL).json()

const userIds = [1, 2, 3];

(async () => {
  //       const [ 
  //         users,
  //         todos,
  //         posts
  //       ] = await Promise.all([ getUsers(), getTodos(), getPosts() ]);

  
       const userList = await Promise.all(
          userIds.map(async (u) => getUsersById(u))
        )
        console.log(userList)

  // console.log(users.length, todos.length, posts.length)

  // console.log(usersById)
})()
