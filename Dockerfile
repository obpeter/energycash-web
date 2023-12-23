FROM caddy/caddy

ADD dist /var/www/html/vfeeg-web/

ADD caddy.conf /etc/caddy/Caddyfile
