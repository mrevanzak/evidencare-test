# This Dockerfile sets up a multi-stage build for a Node.js application.
# It uses the node:20-slim base image and sets environment variables for pnpm.
# The corepack package manager is enabled and the application code is copied to the /app directory.

FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

# The prod-deps stage installs production dependencies using pnpm.
# It uses a cache volume for pnpm store and installs dependencies from the frozen lockfile.

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# The build stage installs dependencies and builds the application using pnpm.
# It also uses the cache volume for pnpm store and runs the build command.

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# The final stage uses the base image and copies the node_modules and dist directories from the prod-deps and build stages, respectively.
# It exposes port 8000 and sets the command to start the application using pnpm.

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
EXPOSE 3000
CMD [ "pnpm", "start" ]
