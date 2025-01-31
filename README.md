# Fullstack Challenge

This project is a fullstack application built with a modern tech stack. It uses Docker for containerization, PostgreSQL for the database, MinIO for S3 storage, and a combination of backend and frontend services. The application features passwordless authentication using magic links and JWT for secure user sessions.

---

## Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Docker** ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose** ([Install Docker Compose](https://docs.docker.com/compose/install/))
- **pnpm** ([Install pnpm](https://pnpm.io/installation))

---

## Getting Started

### 1. Start the Docker Containers

Run the following command to start all the required services:

```bash
docker-compose -f docker-compose.yml up -d
```

This will start the following containers:

- **PostgreSQL Database** at `localhost:5432`
- **Adminer** (Database Management) at [http://localhost:5050](http://localhost:5050)
- **Maildev** (Email Testing) at [http://localhost:1080](http://localhost:1080)
- **MinIO** (S3 Storage) at [http://localhost:9000](http://localhost:9000)
- **MinIO Client** (Bucket Setup)

---

### 2. Configure MinIO

1. Access the MinIO web interface at [http://localhost:9000](http://localhost:9000).
2. Log in with the following credentials:
   - **Username**: `minioadmin`
   - **Password**: `minioadmin`
3. Create a bucket named `pictures` and set its configuration to **public**.

---

### 3. Install Dependencies

Run the following command to install dependencies for the project:

```bash
pnpm install
```

---

### 4. Set Up the Backend

1. Navigate to the `backend` folder and create a `.env` file with the following content:

   ```bash
   # Database Configuration
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fullstack-challenge"

   # Environment
   NODE_ENV=development

   # Authentication
   MAGIC_LINK_SECRET=development_magic_link_secret
   JWT_SECRET=developmentsecret
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_SECRET=developmentrefreshsecret
   JWT_REFRESH_EXPIRES_IN=7d
   COOKIE_EXPIRES_IN=604800 # 1 week

   # URLs
   SERVER_URL=http://localhost:4000
   FRONTEND_URL=http://localhost:3000

   # S3 Storage
   S3_ENDPOINT=http://localhost:9000
   S3_PICTURE_BUCKET=pictures
   S3_KEY=minioadmin
   S3_SECRET=minioadmin
   S3_REGION=us-east-1

   # Email
   MAIL_TRANSPORT=smtp://user:pass@localhost:1025
   MAIL_FROM="Example <noreply@app.com>"
   ```

2. Run the following commands to set up the database:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. Start the backend server:

   ```bash
   pnpm start:dev
   ```

   The backend will be available at [http://localhost:4000](http://localhost:4000).

---

### 5. Set Up the Frontend

1. Navigate to the `frontend` folder and create a `.env.local` file with the following content:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
   ```

2. Start the frontend development server:

   ```bash
   pnpm dev
   ```

   The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## Key Features

### Authentication
- The application uses **passwordless authentication** with magic links.
- Users can log in or create an account by entering their email in the sidebar form.
- A verification link is sent to the provided email address.
- If using the `maildev` container, you can view sent emails at [http://localhost:1080](http://localhost:1080).

### Database Seeding
- You can insert mocked data into the development database using the Swagger documentation routes.
  ![Swagger Routes](https://github.com/user-attachments/assets/de555180-5dc0-439f-85e7-78286a773f0b)

### Frontend Login Form
- The frontend includes a sidebar form for email-based login or account creation.
  ![Login Form](https://github.com/user-attachments/assets/5ed19687-e9d4-43e3-8088-dab6374563df)

---

## Running Tests

To run tests for both the backend and frontend, use the following command in their respective folders:

```bash
pnpm test
```

---

## Project Structure

- **Backend**: Handles API requests, database interactions, and authentication.
- **Frontend**: A Next.js application for the user interface.
- **Docker**: Contains configurations for containerized services.

---

## Troubleshooting

- **Docker Issues**: Ensure Docker is running and ports are not occupied.
- **MinIO Configuration**: Verify the `pictures` bucket is public.
- **Environment Variables**: Double-check `.env` files for correct values.
