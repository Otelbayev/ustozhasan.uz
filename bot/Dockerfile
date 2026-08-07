# Deploy uchun (Railway, Render, Fly.io, VPS + Docker).
# Local development uchun kerak emas — `npm run dev` yetarli.

FROM node:20-alpine

# Silliq to'xtash uchun: PID 1 sifatida node emas, tini ishlaydi va
# SIGTERM signalini to'g'ri uzatadi (aks holda deploy paytida navbatdagi
# hodisalar bazaga yozilmay qoladi).
RUN apk add --no-cache tini

WORKDIR /app

# Avval faqat manifestlar — kod o'zgarganda npm ci qayta ishlamaydi (kesh)
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Root'dan ishlatmaymiz: konteyner buzib kirilsa ham huquqlar cheklangan
USER node

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "src/index.js"]
