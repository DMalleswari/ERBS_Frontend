# ERBS Frontend

React client for the Enterprise Booking & Reservation System.

## Run

The API address comes from `.env`:

```bash
VITE_API_URL=http://localhost:5000/api/v1
```

That port is the backend `PORT`. Copy `.env.example` if `.env` is missing, then:

```bash
npm install
npm run dev
```

Open http://localhost:5173. Restart Vite after changing `.env`. The access token is stored in the browser and sent as `Authorization: Bearer`.
