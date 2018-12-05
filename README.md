Created with [Create React App](https://github.com/facebook/create-react-app).

## Requeriments

 - [Node JS](https://nodejs.org/en/)
 - This application works in conjunction with its corresponding [API](https://github.com/luizPablo/node-api)

## First steps
- Clone the repository on your computer	
- In the project directory, run the following commands
	- `npm install`
	- `npm start`
		- Runs the app in the development mode. 
		- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
		- The page will reload if you make edits.
		- You will also see any lint errors in the console.
 - If all goes well, something similar to the image below will appear on your terminal
 ![enter image description here](https://i.postimg.cc/Dy79s4K5/Screenshot-from-2018-12-04-21-16-18.png)
	 
	 - The address described in "**On Your Network**" is important, through it you can access the application on any device on the same network, including a smartphone. In order for other devices, in addition to local computer, to access the API, it is necessary to change the API baseUrl in the file */src/services/api.js*. Change "*localhost*" to the IP that appears on your terminal and run again the project with `npm start`. Just the address, keep the port. In my case it was like this:
	 	- `const api = axios.create({ baseURL: 'http://10.0.0.106:5000' });`
	 
## Functionalities
- Register users
- Login
- Create posts
- Follow users
- See who an user follows
- See who follows an user
- See who following an user
- See who an user following
- See user's profiles
- Like posts
- See who likes a post
- Search by words, hashtags and users in the same field
- See post by hashtags (on click her)

## Development
- The application was build with [React JS](https://reactjs.org/)
- All dependencies are at the file *package.json*
- The application have a responsive layout, so works well in all devices
- My idea was to make an intuitive application, so it should be easy to use it

## Screenshoots
![enter image description here](https://i.postimg.cc/zvqR8FH9/Screenshot-from-2018-12-04-20-52-58.png)

![enter image description here](https://i.postimg.cc/QxxWzS37/Screenshot-from-2018-12-04-20-55-29.png)

![enter image description here](https://i.postimg.cc/63fyj4bz/Screenshot-from-2018-12-04-20-53-04.png)

![enter image description here](https://i.postimg.cc/fb4yMf6B/Screenshot-from-2018-12-04-20-53-34.png)
