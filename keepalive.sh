#!/bin/bash
# MIES 360 Keepalive - Monitor and restart Next.js dev server
LOG="/home/z/my-project/keepalive.log"
DEVLOG="/home/z/my-project/dev.log"

echo "$(date) === KEEPALIVE STARTED ===" > "$LOG"

while true; do
    # Check if server responds
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000 2>/dev/null)
    
    if [ "$HTTP_CODE" != "200" ]; then
        echo "$(date) Server down (HTTP: $HTTP_CODE). Restarting..." >> "$LOG"
        
        # Kill everything related
        pkill -9 -f "next" 2>/dev/null
        pkill -9 -f "turbo" 2>/dev/null
        pkill -9 -f "bun" 2>/dev/null
        sleep 2
        
        # Clean .next cache to prevent memory bloat
        rm -rf /home/z/my-project/.next/cache 2>/dev/null
        
        # Restart fresh
        cd /home/z/my-project
        nohup bun run dev >> "$DEVLOG" 2>&1 &
        
        # Wait and verify
        sleep 8
        NEW_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3000 2>/dev/null)
        echo "$(date) Restart result: HTTP $NEW_CODE" >> "$LOG"
    fi
    
    # Check every 10 seconds
    sleep 10
done
