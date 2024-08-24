![image](https://github.com/user-attachments/assets/a7bd55d1-2e91-40ab-b6a0-80540c645750)

# About this project

The backend for [Untitled Music Streaming Thing](https://github.com/weareblahs/UntitledMusicStreamingThing), which is needed for running the app itself.

# How to get started?

## 1. Set up the server.

Assuming that you have Node.js and MongoDB installed (set to the default 27017 port), clone this repository. Ensure that port 5000 is free since the server and the app itself uses this port for communication.

```bash
git clone https://github.com/weareblahs/UMSTServer
cd UMSTServer
```

## 2. Install required modules for the app to run.

This will install all required modules for the server to run properly.

```bash
npm install
```

## 3. Start the server.

After you added all required modules, start the server.

```bash
nodemon
```

## 4. ...get back to Untitled Music Streaming Thing guide, step 2.

If you are planning to use Untitled Music Streaming Thing after setting up the server, go to [this link](https://github.com/weareblahs/UntitledMusicStreamingThing/?tab=readme-ov-file#2-clone-this-repository).

# Credits (otherwise known as "What does this project use?")

| Application / Component name                                                           | Usage                               |
| -------------------------------------------------------------------------------------- | ----------------------------------- |
| [MongoDB](https://www.mongodb.com/)                                                    | Backend database                    |
| [Express.js](https://expressjs.com/)                                                   | Backend API Controls                |
| [Node.js](https://nodejs.org/en)                                                       | Frontend/backend base               |
| [Express.js Multer](https://github.com/expressjs/multer)                               | File uploading middleware           |
| [mongoose-fuzzy-searching](https://github.com/VassilisPallas/mongoose-fuzzy-searching) | Used for searching albums and songs |
