# ExpressLaunch

A lightweight Node.js and Express backend boilerplate generator that helps you create a clean, organized backend structure in seconds.

## Features

- Quick Express.js backend setup
- Clean and organized folder structure
- Routes and controllers structure
- Middleware structure
- Database configuration structure
- CORS support
- Cookie parser support
- Environment variable support with dotenv
- Mongoose support
- Nodemon development setup

## Usage

Run ExpressLaunch directly with:

```bash
npx expresslaunch
```

ExpressLaunch will create a `backend` folder in your current project.

## Generated Structure

```text
backend/
├── controllers/
├── db/
├── middlewares/
├── models/
├── routes/
├── .env
└── server.js
```

## Getting Started

After generating the backend:

```bash
cd backend
npm install
```

Configure your `.env` file as required.

Start the development server:

```bash
npm run dev
```

Start the server normally:

```bash
npm start
```

## Why ExpressLaunch?

Setting up the same Express backend structure for every project can be repetitive.

ExpressLaunch provides a reusable starting point so you can focus on building your API instead of repeating the initial setup.

## License

ISC

## Author

Akhil Sai
