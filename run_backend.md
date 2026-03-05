. Command to run the Laravel backend
From your Laravel backend folder (where artisan lives), run:
php artisan serve --host=0.0.0.0 --port=8000
--host=0.0.0.0 makes the server listen on all network interfaces so your phone/Expo app can reach it.
--port=8000 matches the port you’re using in the React Native app.
2. How to access it
On the same PC (browser/Postman): open
http://localhost:8000
(not http://0.0.0.0:8000 – 0.0.0.0 is only the bind address, not a URL you browse to).
From your Expo app on a phone: keep using the LAN IP you already configured, e.g.
http://192.168.0.108:8000/api/...