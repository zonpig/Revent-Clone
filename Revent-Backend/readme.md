# Revent Backend

Server functions supporting App, Web and Hardware

<!-- ABOUT THE PROJECT -->

## APIs

| APIs             | Function                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| addReceipt           | Once POS send data over to the hardware, the hardware would call the function to upload the receipt to the server                                  |
| addSpendingRecord    | When new user is created, this function automatically creates a new spending document for the user in the spendings collection                     |
| updateSpendingRecord | When user adds receipt to his account, this function would automatically update the user's spending document to reflect this new receipt           |
| userDeleted          | Once user document is deleted from the collection, this function would automatically select the spending document associated with the deleted user |

## Built With

[![Node Js][Node.js]][Node.js-url][![Firebase][firebase]][firebase-url]

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```
- firebase
  ```sh
    npm install -g firebase-tools
    firebase login
  ```

### Installation

1. Set up your firebase project at [https://firebase.google.com/](https://firebase.google.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/Revent-eco/Revent-Backend.git
   ```
3. Install NPM packages
   ```sh
   cd Desktop/Revent-Backend
   npm install
   ```

### Upload New Functions

- To upload new functions
  ```sh
  firebase deploy --only functions
  ```

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node.js-url]: http://nodejs.org
[firebase]: https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase
[firebase-url]: https://firebase.google.com
