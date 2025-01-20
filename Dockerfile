
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM base AS production
WORKDIR /usr/src/prod
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json /usr/src/app/pnpm-lock.yaml ./
COPY --from=build /usr/src/app/./scripts/fetch-secrets.sh ./scripts/fetch-secrets.sh
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --ignore-scripts
RUN apk update && apk add --no-cache jq curl unzip aws-cli
RUN chmod +x ./scripts/fetch-secrets.sh

CMD ["sh","-c","./scripts/fetch-secrets.sh && node dist/src/main.js"]
