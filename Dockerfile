FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

# NEXT_PUBLIC_* vars are inlined into the JS bundle at compile time.
# These are placeholders — real values come from .env.local at runtime.
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://postgres:placeholder@localhost:5432/docpad"
ENV NEXTAUTH_SECRET="d72d32dec21a2fbffcc9a0ae3095aac832d7025bd3bb69a9584019d3b4041797"
ENV NEXTAUTH_URL="http://localhost:3000"
ENV NEXT_PUBLIC_URL="http://localhost:3000/"
ENV NEXT_PUBLIC_API_KEY="pk_test_51Np3S4BsIgBDC6ITGIMgKP51JbKL9TabLjatX6tqIoBkoIoCNyuXWmVfzim19PinwZWyxGzrAVf5PxB5NNWj07bD00LjvRW85l"

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy built output and source needed at runtime
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/service ./service
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Install production dependencies at runtime in the final image
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
