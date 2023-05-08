FROM caddy/caddy

ADD build /var/www/html/vfeeg-web/

ADD caddy.conf /etc/caddy/Caddyfile
