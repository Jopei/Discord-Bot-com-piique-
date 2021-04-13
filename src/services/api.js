import axios from 'axios';

console.log(process.env.API_TOKEN);
const api = axios.create({
  baseURL: 'https://api.atividadespuc.pedrovilaca.com/',
  // baseURL: 'http:/localhost:8000/',
  timeout: 10000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${process.env.API_TOKEN ?? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLmF0aXZpZGFkZXNwdWMucGVkcm92aWxhY2EuY29tXC9hcGlcL2xvZ2luIiwiaWF0IjoxNjE4MjcxODQyLCJuYmYiOjE2MTgyNzE4NDIsImp0aSI6Ik5kVjlwTzVjYU9jc2ZXSjkiLCJzdWIiOjE4LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.SY9oOMNxY02HGXozUhI4EmZksAmGYrvnmOGITl6oUQY'}`,
  },
});

export default api;
