S.A.R.E - Web (React + Vite + Tailwind)

Como usar:

1. Extraia a pasta SARE-web em seu computador.
2. Abra o terminal na pasta extraída (a pasta que contém package.json).
3. Rode:
   npm install
   npm run mock-api   # em um terminal (levanta a API fake em http://localhost:4000)
   npm run dev        # em outro terminal (levanta frontend em http://localhost:5173)

Observações:
- O projeto já vem com Tailwind configurado. Se tiver problemas com npx, use a CDN (já incluida no index.html) e o app ainda funcionará visualmente.
- Para um backend real, substitua o json-server por uma API Express/Node ou Firebase.
