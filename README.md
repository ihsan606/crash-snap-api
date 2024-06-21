# CrashSnap API

CrashSnap API is a service designed to predict vehicle damage repair costs from uploaded images. This API is built using Node.js and Express, and uses Multer to handle image uploads. The API integrates with a machine learning model to provide accurate repair cost predictions based on the images of the damage.

## Features

- Upload vehicle damage images and get repair cost predictions.
- View prediction history.
- View prediction details by ID.
- Delete predictions by ID.
- Integrated with a machine learning model for accurate predictions.

## Installation

1. **Clone this repository**

    ```bash
    git clone https://github.com/username/crashsnap-api.git
    cd crashsnap-api
    ```

2. **Install dependencies**

    Make sure you have [Node.js](https://nodejs.org/) installed on your machine. Then run the following command:

    ```bash
    npm install
    ```

3. **Configuration**

    Create a `.env` file in the root directory of your project and add the necessary configuration (example):

    ```dotenv
    PORT=3000
    ```

4. **Run the application**

    Start the application with:

    ```bash
    npm start
    ```

    For development, you can use `nodemon`:

    ```bash
    npm run dev
    ```

## Usage

This API provides several endpoints for various operations. Here is a list of available endpoints:

### 1. Predict Damage Repair Cost

- **Endpoint**: `/cost`
- **Method**: `POST`
- **Description**: Upload vehicle damage images and get repair cost predictions. This endpoint uses a machine learning model to analyze the images and provide an estimated repair cost.
- **Parameters**:
  - `image`: Array of images (form-data)

- **Request Example**:

    ```http
    POST /cost
    Content-Type: multipart/form-data

    image: [file1.jpg, file2.jpg]
    ```

- **Response Example**:

    ```json
    {
      "id": "prediction_id",
      "cost": 5000,
      "message": "Prediction successful"
    }
    ```

### 2. View Prediction History

- **Endpoint**: `/`
- **Method**: `GET`
- **Description**: Get all prediction history.

- **Request Example**:

    ```http
    GET /
    ```

- **Response Example**:

    ```json
    [
      {
        "id": "prediction_id_1",
        "cost": 5000,
        "date": "2023-06-21"
      },
      {
        "id": "prediction_id_2",
        "cost": 3000,
        "date": "2023-06-22"
      }
    ]
    ```

### 3. View Prediction Details

- **Endpoint**: `/:id/detail`
- **Method**: `GET`
- **Description**: Get prediction details by ID.
- **Parameters**:
  - `id`: Prediction ID

- **Request Example**:

    ```http
    GET /12345/detail
    ```

- **Response Example**:

    ```json
    {
      "id": "12345",
      "cost": 5000,
      "date": "2023-06-21",
      "details": "Detailed information about the prediction"
    }
    ```

### 4. Delete Prediction

- **Endpoint**: `/:id/delete`
- **Method**: `DELETE`
- **Description**: Delete prediction by ID.
- **Parameters**:
  - `id`: Prediction ID

- **Request Example**:

    ```http
    DELETE /12345/delete
    ```

- **Response Example**:

    ```json
    {
      "message": "Prediction deleted successfully"
    }
    ```

## Contribution

If you want to contribute to this project, please create a pull request or open a new issue in this repository. Your contributions are greatly appreciated!

## Authors

- Ihsansyafiul
- Faturihsan

## License

This project is licensed under the [MIT License](LICENSE).
