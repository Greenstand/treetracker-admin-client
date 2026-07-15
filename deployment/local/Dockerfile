# Local e2e image for the admin-client /verify UI.
# Stage 1: CRA production build. REACT_APP_API_ROOT="" ⇒ the app makes RELATIVE calls
#   (/auth/login, /api/trees), which nginx (stage 2) reverse-proxies to admin-api in-cluster.
#   Same-origin ⇒ no CORS, and the browser needs only ONE host port-forward (to this pod).
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund --legacy-peer-deps
COPY . .
ENV REACT_APP_API_ROOT="" \
    REACT_APP_TREETRACKER_API_ROOT="" \
    REACT_APP_QUERY_API_ROOT="/query" \
    REACT_APP_GROWER_QUERY_API_ROOT="/grower" \
    REACT_APP_IMAGES_API_ROOT="/images" \
    REACT_APP_REGION_API_ROOT="/region" \
    REACT_APP_WEBMAP_DOMAIN="" \
    REACT_APP_ENABLE_CAPTURE_MATCHING=false \
    REACT_APP_ENABLE_MESSAGING=false \
    REACT_APP_ENABLE_REGIONS=false \
    REACT_APP_ENABLE_STAKEHOLDERS=false \
    REACT_APP_ENABLE_TOOLTIPS=false \
    GENERATE_SOURCEMAP=false \
    CI=false
RUN npm run build

# Stage 2: nginx serves the static build + proxies API traffic to admin-api.
FROM nginx:1.27-alpine
COPY deployment/local/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
