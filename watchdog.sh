#!/bin/bash
LOG="/home/z/my-project/watchdog.log"

echo "$(date) === WATCHDOG STARTED ===" > "$LOG"

while true; do
    HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000 2>/dev/null)
    
    if [ "$HTTP" != "200" ]; then
        echo "$(date) DOWN (HTTP:$HTTP) - restarting..." >> "$LOG"
        pkill -9 -f "next" 2>/dev/null
        pkill -9 -f "turbo" 2>/dev/null
        sleep 2
        rm -rf /home/z/my-project/.next/cache 2>/dev/null
        cd /home/z/my-project && nohup bun run dev >> dev.log 2>&1 &
        sleep 10
        echo "$(date) Back up: $(curl -s -o /dev/null -w '%{http_code}' --max-time 5 http://localhost:3000)" >> "$LOG"
    fi
    sleep 8
done
